
# BizFlow KE — Backend, Database & Business Logic Spec

Complete Supabase backend specification for BizFlow KE. This document is the source of truth for the database schema, Row Level Security (RLS) policies, RPC functions, Edge Functions, and offline sync logic.

> **Stack:** Supabase (Postgres 15+, Auth, Storage, Edge Functions / Deno), pgcrypto, uuid-ossp.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Client (React / Flutter)                                   │
│  - Offline cache (IndexedDB / Hive)                         │
│  - Optimistic writes → sync queue                           │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS + JWT
┌──────────────────▼──────────────────────────────────────────┐
│  Supabase                                                   │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────────┐    │
│  │  Auth (JWT)    │  │ Postgres + RLS│  │ Edge Fns     │    │
│  │  email/phone/  │  │ Schema below  │  │ create_sale  │    │
│  │  google OAuth  │  │ + RPCs        │  │ mpesa_webhook│    │
│  └────────────────┘  └───────────────┘  └──────────────┘    │
│  ┌────────────────┐  ┌───────────────┐                      │
│  │  Storage       │  │  Realtime     │                      │
│  │  receipts,     │  │  low_stock,   │                      │
│  │  product_imgs  │  │  sales feed   │                      │
│  └────────────────┘  └───────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

**Tenancy model:** Every domain row carries `business_id`. Most also carry `branch_id`. RLS enforces that an authenticated user can only access rows for businesses they're a member of.

---

## 2. Extensions

```sql
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";   -- fast product search
create extension if not exists "btree_gist"; -- exclusion constraints
```

---

## 3. Enums

```sql
create type user_role as enum ('owner', 'manager', 'cashier', 'accountant');
create type payment_method as enum ('cash', 'mpesa', 'card', 'credit', 'bank_transfer');
create type sale_status as enum ('completed', 'refunded', 'voided', 'pending');
create type stock_movement_type as enum (
  'purchase', 'sale', 'adjustment', 'transfer_in', 'transfer_out',
  'return', 'damage', 'expiry', 'opening_stock'
);
create type expense_category as enum (
  'rent', 'utilities', 'salaries', 'transport', 'supplies',
  'marketing', 'tax', 'maintenance', 'other'
);
create type tax_type as enum ('vat_16', 'vat_8', 'vat_0', 'exempt');
```

---

## 4. Core Schema

### 4.1 Businesses

```sql
create table businesses (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  legal_name      text,
  kra_pin         text unique,          -- KRA PIN (P051234567X)
  vat_number      text,                 -- VAT registration #
  phone           text,
  email           text,
  logo_url        text,
  industry        text,                 -- shop, pharmacy, agrovet, restaurant
  base_currency   char(3) not null default 'KES',
  timezone        text not null default 'Africa/Nairobi',
  is_vat_registered boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
```

### 4.2 Branches

```sql
create table branches (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  name            text not null,
  code            text,                 -- short code e.g. "NRB-01"
  address         text,
  county          text,                 -- Nairobi, Mombasa, etc.
  phone           text,
  is_main         boolean default false,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  unique (business_id, code)
);
create index on branches(business_id);
```

### 4.3 Users & Memberships

Supabase `auth.users` holds the identity. We mirror profile data and join via `business_members`.

```sql
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  phone           text,
  avatar_url      text,
  preferred_language text default 'en', -- en, sw
  created_at      timestamptz default now()
);

create table business_members (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  branch_id       uuid references branches(id) on delete set null, -- null = all branches
  role            user_role not null default 'cashier',
  is_active       boolean default true,
  invited_by      uuid references auth.users(id),
  joined_at       timestamptz default now(),
  unique (business_id, user_id)
);
create index on business_members(user_id);
create index on business_members(business_id, role);
```

### 4.4 Suppliers & Customers

```sql
create table suppliers (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  name            text not null,
  contact_person  text,
  phone           text,
  email           text,
  kra_pin         text,
  address         text,
  balance         numeric(14,2) default 0, -- amount we owe them
  is_active       boolean default true,
  created_at      timestamptz default now()
);
create index on suppliers(business_id);

create table customers (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  full_name       text not null,
  phone           text,
  email           text,
  kra_pin         text,
  loyalty_points  integer default 0,
  total_spent     numeric(14,2) default 0,
  credit_limit    numeric(14,2) default 0,
  balance         numeric(14,2) default 0, -- amount they owe us
  notes           text,
  created_at      timestamptz default now()
);
create index on customers(business_id);
create index on customers using gin (phone gin_trgm_ops);
```

### 4.5 Products & Categories

```sql
create table categories (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  name            text not null,
  parent_id       uuid references categories(id) on delete set null,
  color           text,
  created_at      timestamptz default now(),
  unique (business_id, name)
);

create table products (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  category_id     uuid references categories(id) on delete set null,
  supplier_id     uuid references suppliers(id) on delete set null,
  sku             text,
  barcode         text,
  name            text not null,
  description     text,
  unit            text default 'pc',     -- pc, kg, litre, packet
  cost_price      numeric(14,2) not null default 0,
  selling_price   numeric(14,2) not null default 0,
  wholesale_price numeric(14,2),
  tax_type        tax_type not null default 'vat_16',
  reorder_level   integer default 0,
  track_expiry    boolean default false,
  image_url       text,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (business_id, sku),
  unique (business_id, barcode)
);
create index on products(business_id);
create index on products using gin (name gin_trgm_ops);
create index on products(barcode);
```

### 4.6 Inventory (per branch)

We separate `inventory` (current quantity per branch) from `stock_movements` (immutable ledger).

```sql
create table inventory (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  branch_id       uuid not null references branches(id) on delete cascade,
  product_id      uuid not null references products(id) on delete cascade,
  quantity        numeric(14,3) not null default 0,
  updated_at      timestamptz default now(),
  unique (branch_id, product_id)
);
create index on inventory(business_id, branch_id);

create table product_batches (        -- for expiry tracking (pharmacy, agro-vet)
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  branch_id       uuid not null references branches(id) on delete cascade,
  product_id      uuid not null references products(id) on delete cascade,
  batch_number    text,
  expiry_date     date,
  quantity        numeric(14,3) not null default 0,
  cost_price      numeric(14,2),
  created_at      timestamptz default now()
);
create index on product_batches(product_id, expiry_date);

create table stock_movements (         -- immutable ledger
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  branch_id       uuid not null references branches(id) on delete cascade,
  product_id      uuid not null references products(id) on delete cascade,
  batch_id        uuid references product_batches(id) on delete set null,
  movement_type   stock_movement_type not null,
  quantity        numeric(14,3) not null, -- positive in, negative out
  unit_cost       numeric(14,2),
  reference_type  text,                -- 'sale','purchase_order','adjustment'
  reference_id    uuid,
  notes           text,
  created_by      uuid references auth.users(id),
  created_at      timestamptz default now()
);
create index on stock_movements(business_id, created_at desc);
create index on stock_movements(product_id, created_at desc);
create index on stock_movements(reference_type, reference_id);
```

### 4.7 Sales

```sql
create table sales (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  branch_id       uuid not null references branches(id) on delete cascade,
  customer_id     uuid references customers(id) on delete set null,
  cashier_id      uuid references auth.users(id),
  receipt_number  text not null,       -- BIZ-NRB01-2026-000123
  subtotal        numeric(14,2) not null default 0,
  discount_amount numeric(14,2) not null default 0,
  tax_amount      numeric(14,2) not null default 0,
  total_amount    numeric(14,2) not null default 0,
  amount_paid     numeric(14,2) not null default 0,
  change_given    numeric(14,2) not null default 0,
  payment_method  payment_method not null,
  status          sale_status not null default 'completed',
  mpesa_code      text,                -- MPESA confirmation code
  notes           text,
  client_uuid     uuid unique,         -- idempotency key from offline client
  created_at      timestamptz default now(),
  unique (business_id, receipt_number)
);
create index on sales(business_id, created_at desc);
create index on sales(branch_id, created_at desc);
create index on sales(cashier_id, created_at desc);
create index on sales(client_uuid);

create table sale_items (
  id              uuid primary key default uuid_generate_v4(),
  sale_id         uuid not null references sales(id) on delete cascade,
  product_id      uuid not null references products(id),
  product_name    text not null,       -- snapshot
  sku             text,                -- snapshot
  quantity        numeric(14,3) not null,
  unit_price      numeric(14,2) not null,
  cost_price      numeric(14,2) not null, -- snapshot for profit calc
  discount        numeric(14,2) not null default 0,
  tax_type        tax_type not null default 'vat_16',
  tax_amount      numeric(14,2) not null default 0,
  line_total      numeric(14,2) not null
);
create index on sale_items(sale_id);
create index on sale_items(product_id);
```

### 4.8 Expenses

```sql
create table expenses (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  branch_id       uuid references branches(id) on delete cascade,
  category        expense_category not null,
  description     text not null,
  amount          numeric(14,2) not null,
  payment_method  payment_method not null default 'cash',
  vendor_name     text,
  receipt_url     text,                -- scanned receipt in storage
  expense_date    date not null default current_date,
  created_by      uuid references auth.users(id),
  created_at      timestamptz default now()
);
create index on expenses(business_id, expense_date desc);
```

### 4.9 Loyalty

```sql
create table loyalty_transactions (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references businesses(id) on delete cascade,
  customer_id     uuid not null references customers(id) on delete cascade,
  sale_id         uuid references sales(id) on delete set null,
  points          integer not null,    -- positive earn, negative redeem
  reason          text,
  created_at      timestamptz default now()
);
create index on loyalty_transactions(customer_id, created_at desc);
```

### 4.10 Audit Log

```sql
create table audit_log (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null,
  user_id         uuid references auth.users(id),
  action          text not null,       -- 'sale.create','product.update','price.change'
  entity_type     text not null,
  entity_id       uuid,
  before_data     jsonb,
  after_data      jsonb,
  ip_address      inet,
  created_at      timestamptz default now()
);
create index on audit_log(business_id, created_at desc);
```

---

## 5. Row Level Security (RLS)

Enable RLS on every table:

```sql
alter table businesses          enable row level security;
alter table branches            enable row level security;
alter table profiles            enable row level security;
alter table business_members    enable row level security;
alter table suppliers           enable row level security;
alter table customers           enable row level security;
alter table categories          enable row level security;
alter table products            enable row level security;
alter table inventory           enable row level security;
alter table product_batches     enable row level security;
alter table stock_movements     enable row level security;
alter table sales               enable row level security;
alter table sale_items          enable row level security;
alter table expenses            enable row level security;
alter table loyalty_transactions enable row level security;
alter table audit_log           enable row level security;
```

### 5.1 Helper Functions (SECURITY DEFINER)

```sql
-- Returns the businesses the current user is a member of
create or replace function auth.user_business_ids()
returns setof uuid
language sql stable security definer
set search_path = public
as $$
  select business_id from public.business_members
  where user_id = auth.uid() and is_active = true;
$$;

-- Returns the role of the current user for a given business
create or replace function auth.user_role(p_business_id uuid)
returns user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.business_members
  where user_id = auth.uid() and business_id = p_business_id and is_active = true
  limit 1;
$$;

-- Convenience: is current user owner/manager of business
create or replace function auth.is_manager(p_business_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where user_id = auth.uid() and business_id = p_business_id
      and role in ('owner','manager') and is_active = true
  );
$$;
```

### 5.2 Policies (representative — apply pattern to every table)

```sql
-- profiles: each user manages their own
create policy "profiles self read"    on profiles for select using (id = auth.uid());
create policy "profiles self update"  on profiles for update using (id = auth.uid());
create policy "profiles self insert"  on profiles for insert with check (id = auth.uid());

-- businesses: members can read, only owners can update
create policy "biz read members"   on businesses for select
  using (id in (select auth.user_business_ids()));
create policy "biz update owner"   on businesses for update
  using (auth.user_role(id) = 'owner');
create policy "biz insert auth"    on businesses for insert
  with check (auth.uid() is not null);

-- business_members: owners/managers manage, members read self
create policy "members read"   on business_members for select
  using (
    user_id = auth.uid()
    or business_id in (select auth.user_business_ids())
  );
create policy "members write owner/manager" on business_members for all
  using (auth.is_manager(business_id))
  with check (auth.is_manager(business_id));

-- generic "scope to business" pattern for products, inventory, sales, etc.
create policy "products read"   on products for select
  using (business_id in (select auth.user_business_ids()));
create policy "products write owner/manager" on products for all
  using (auth.is_manager(business_id))
  with check (auth.is_manager(business_id));

-- sales: cashiers can insert + read their own branch; managers see all
create policy "sales read scoped" on sales for select
  using (
    business_id in (select auth.user_business_ids())
    and (
      auth.is_manager(business_id)
      or branch_id in (
        select branch_id from business_members
        where user_id = auth.uid() and business_id = sales.business_id
      )
    )
  );
create policy "sales insert cashier" on sales for insert
  with check (
    business_id in (select auth.user_business_ids())
    and cashier_id = auth.uid()
  );
create policy "sales void manager" on sales for update
  using (auth.is_manager(business_id))
  with check (auth.is_manager(business_id));

-- stock_movements: read scoped, insert via RPC only (no direct insert)
create policy "stock read" on stock_movements for select
  using (business_id in (select auth.user_business_ids()));
-- intentionally no INSERT/UPDATE policy — only SECURITY DEFINER RPCs may write.

-- audit_log: managers/owners read only; writes via triggers
create policy "audit read managers" on audit_log for select
  using (auth.is_manager(business_id));
```

> **Pattern:** For every other table (`suppliers`, `customers`, `categories`, `inventory`, `expenses`, `loyalty_transactions`), apply the same two-policy pair: `read scoped to user_business_ids()` + `write requires is_manager()` (or relax write for cashier on insert where appropriate, e.g. `expenses`).

---

## 6. RPC Functions (Postgres)

### 6.1 `create_sale` — Atomic sale with stock deduction

```sql
create or replace function create_sale(
  p_business_id   uuid,
  p_branch_id     uuid,
  p_customer_id   uuid,
  p_payment_method payment_method,
  p_amount_paid   numeric,
  p_mpesa_code    text,
  p_items         jsonb,    -- [{product_id, quantity, unit_price, discount}]
  p_client_uuid   uuid,
  p_discount_amount numeric default 0,
  p_notes         text default null
) returns sales
language plpgsql security definer
set search_path = public
as $$
declare
  v_sale          sales;
  v_item          jsonb;
  v_product       products;
  v_qty           numeric;
  v_unit_price    numeric;
  v_discount      numeric;
  v_subtotal      numeric := 0;
  v_tax_total     numeric := 0;
  v_total         numeric;
  v_tax_rate      numeric;
  v_line_tax      numeric;
  v_line_total    numeric;
  v_inv           inventory;
  v_receipt_no    text;
  v_year          text;
  v_seq           integer;
  v_branch_code   text;
begin
  -- Auth check
  if not exists (
    select 1 from business_members
    where user_id = auth.uid() and business_id = p_business_id and is_active = true
  ) then
    raise exception 'not a member of this business' using errcode = '42501';
  end if;

  -- Idempotency: if client_uuid already exists, return the prior sale
  if p_client_uuid is not null then
    select * into v_sale from sales where client_uuid = p_client_uuid;
    if found then return v_sale; end if;
  end if;

  -- Generate receipt number: BIZ-{BRANCH}-{YEAR}-{SEQ}
  select code into v_branch_code from branches where id = p_branch_id;
  v_year := to_char(now() at time zone 'Africa/Nairobi', 'YYYY');
  select coalesce(max(
    cast(split_part(receipt_number, '-', 4) as integer)
  ), 0) + 1 into v_seq
  from sales
  where business_id = p_business_id
    and branch_id = p_branch_id
    and receipt_number like 'BIZ-' || coalesce(v_branch_code,'XX') || '-' || v_year || '-%';
  v_receipt_no := 'BIZ-' || coalesce(v_branch_code,'XX') || '-' || v_year
                  || '-' || lpad(v_seq::text, 6, '0');

  -- Insert sale shell
  insert into sales (
    business_id, branch_id, customer_id, cashier_id, receipt_number,
    payment_method, amount_paid, mpesa_code, client_uuid, notes,
    discount_amount, status
  ) values (
    p_business_id, p_branch_id, p_customer_id, auth.uid(), v_receipt_no,
    p_payment_method, p_amount_paid, p_mpesa_code, p_client_uuid, p_notes,
    coalesce(p_discount_amount, 0), 'completed'
  ) returning * into v_sale;

  -- Loop items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products
      where id = (v_item->>'product_id')::uuid and business_id = p_business_id
      for update;
    if not found then
      raise exception 'product % not found', v_item->>'product_id';
    end if;

    v_qty := (v_item->>'quantity')::numeric;
    v_unit_price := coalesce((v_item->>'unit_price')::numeric, v_product.selling_price);
    v_discount := coalesce((v_item->>'discount')::numeric, 0);

    -- Lock inventory row and check stock
    select * into v_inv from inventory
      where branch_id = p_branch_id and product_id = v_product.id
      for update;
    if not found or v_inv.quantity < v_qty then
      raise exception 'insufficient stock for %: have %, need %',
        v_product.name, coalesce(v_inv.quantity, 0), v_qty
        using errcode = 'P0001';
    end if;

    -- Compute tax
    v_tax_rate := case v_product.tax_type
      when 'vat_16' then 0.16
      when 'vat_8'  then 0.08
      else 0
    end;
    v_line_total := (v_unit_price * v_qty) - v_discount;
    -- VAT is treated as inclusive on selling_price (Kenyan convention)
    v_line_tax := v_line_total - (v_line_total / (1 + v_tax_rate));

    insert into sale_items (
      sale_id, product_id, product_name, sku, quantity,
      unit_price, cost_price, discount, tax_type, tax_amount, line_total
    ) values (
      v_sale.id, v_product.id, v_product.name, v_product.sku, v_qty,
      v_unit_price, v_product.cost_price, v_discount,
      v_product.tax_type, v_line_tax, v_line_total
    );

    v_subtotal := v_subtotal + v_line_total;
    v_tax_total := v_tax_total + v_line_tax;

    -- Deduct stock
    update inventory
       set quantity = quantity - v_qty, updated_at = now()
     where id = v_inv.id;

    -- Ledger
    insert into stock_movements (
      business_id, branch_id, product_id, movement_type,
      quantity, unit_cost, reference_type, reference_id, created_by
    ) values (
      p_business_id, p_branch_id, v_product.id, 'sale',
      -v_qty, v_product.cost_price, 'sale', v_sale.id, auth.uid()
    );
  end loop;

  -- Finalize totals
  v_total := v_subtotal;
  update sales
     set subtotal = v_subtotal,
         tax_amount = v_tax_total,
         total_amount = v_total,
         change_given = greatest(p_amount_paid - v_total, 0)
   where id = v_sale.id
   returning * into v_sale;

  -- Update customer loyalty / spend
  if p_customer_id is not null then
    update customers
       set total_spent = total_spent + v_total,
           loyalty_points = loyalty_points + floor(v_total / 100)::int
     where id = p_customer_id;

    insert into loyalty_transactions (business_id, customer_id, sale_id, points, reason)
    values (p_business_id, p_customer_id, v_sale.id, floor(v_total / 100)::int, 'sale');
  end if;

  return v_sale;
end;
$$;

revoke all on function create_sale from public;
grant execute on function create_sale to authenticated;
```

### 6.2 `void_sale` — Reverses a sale and restocks

```sql
create or replace function void_sale(p_sale_id uuid, p_reason text)
returns sales
language plpgsql security definer
set search_path = public
as $$
declare
  v_sale sales;
  v_item sale_items;
begin
  select * into v_sale from sales where id = p_sale_id for update;
  if not found then raise exception 'sale not found'; end if;
  if not auth.is_manager(v_sale.business_id) then
    raise exception 'only managers can void' using errcode = '42501';
  end if;
  if v_sale.status <> 'completed' then
    raise exception 'sale already %', v_sale.status;
  end if;

  for v_item in select * from sale_items where sale_id = p_sale_id loop
    update inventory
       set quantity = quantity + v_item.quantity, updated_at = now()
     where branch_id = v_sale.branch_id and product_id = v_item.product_id;

    insert into stock_movements (
      business_id, branch_id, product_id, movement_type, quantity,
      reference_type, reference_id, created_by, notes
    ) values (
      v_sale.business_id, v_sale.branch_id, v_item.product_id, 'return',
      v_item.quantity, 'sale_void', v_sale.id, auth.uid(), p_reason
    );
  end loop;

  update sales set status = 'voided', notes = coalesce(notes,'') || ' | VOID: ' || p_reason
   where id = p_sale_id returning * into v_sale;
  return v_sale;
end;
$$;
grant execute on function void_sale to authenticated;
```

### 6.3 `adjust_stock` — Manual stock-in / adjustment

```sql
create or replace function adjust_stock(
  p_branch_id uuid, p_product_id uuid, p_delta numeric,
  p_movement_type stock_movement_type, p_unit_cost numeric default null,
  p_batch_number text default null, p_expiry_date date default null,
  p_notes text default null
) returns inventory
language plpgsql security definer set search_path = public as $$
declare
  v_business_id uuid;
  v_inv inventory;
  v_batch_id uuid;
begin
  select business_id into v_business_id from branches where id = p_branch_id;
  if not auth.is_manager(v_business_id) then
    raise exception 'only managers can adjust stock' using errcode = '42501';
  end if;

  if p_batch_number is not null then
    insert into product_batches (business_id, branch_id, product_id, batch_number, expiry_date, quantity, cost_price)
    values (v_business_id, p_branch_id, p_product_id, p_batch_number, p_expiry_date, p_delta, p_unit_cost)
    returning id into v_batch_id;
  end if;

  insert into inventory (business_id, branch_id, product_id, quantity)
  values (v_business_id, p_branch_id, p_product_id, p_delta)
  on conflict (branch_id, product_id) do update
    set quantity = inventory.quantity + excluded.quantity, updated_at = now()
  returning * into v_inv;

  insert into stock_movements (
    business_id, branch_id, product_id, batch_id, movement_type,
    quantity, unit_cost, notes, created_by
  ) values (
    v_business_id, p_branch_id, p_product_id, v_batch_id, p_movement_type,
    p_delta, p_unit_cost, p_notes, auth.uid()
  );
  return v_inv;
end;
$$;
grant execute on function adjust_stock to authenticated;
```

### 6.4 `daily_report` — KPI snapshot

```sql
create or replace function daily_report(
  p_business_id uuid, p_branch_id uuid default null,
  p_date date default current_date
) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_result jsonb;
begin
  if p_business_id not in (select auth.user_business_ids()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  with day_sales as (
    select * from sales
    where business_id = p_business_id
      and (p_branch_id is null or branch_id = p_branch_id)
      and status = 'completed'
      and (created_at at time zone 'Africa/Nairobi')::date = p_date
  ),
  items as (
    select si.* from sale_items si
    join day_sales ds on ds.id = si.sale_id
  )
  select jsonb_build_object(
    'date', p_date,
    'total_sales',       coalesce((select sum(total_amount) from day_sales), 0),
    'transactions',      (select count(*) from day_sales),
    'avg_basket',        coalesce((select avg(total_amount) from day_sales), 0),
    'tax_collected',     coalesce((select sum(tax_amount) from day_sales), 0),
    'gross_profit',      coalesce((select sum((unit_price - cost_price) * quantity) from items), 0),
    'by_payment_method', (select jsonb_object_agg(payment_method, total)
                          from (select payment_method, sum(total_amount) total
                                from day_sales group by payment_method) x),
    'top_products',      (select jsonb_agg(row_to_json(t)) from (
                            select product_id, product_name,
                                   sum(quantity) qty, sum(line_total) revenue
                            from items group by product_id, product_name
                            order by revenue desc limit 5
                          ) t),
    'expenses',          coalesce((select sum(amount) from expenses
                                   where business_id = p_business_id
                                     and (p_branch_id is null or branch_id = p_branch_id)
                                     and expense_date = p_date), 0)
  ) into v_result;
  return v_result;
end;
$$;
grant execute on function daily_report to authenticated;
```

### 6.5 `low_stock_items` — Reorder list

```sql
create or replace function low_stock_items(p_business_id uuid, p_branch_id uuid default null)
returns table (
  product_id uuid, name text, sku text, branch_id uuid,
  quantity numeric, reorder_level integer
)
language sql stable security definer set search_path = public as $$
  select p.id, p.name, p.sku, i.branch_id, i.quantity, p.reorder_level
  from inventory i
  join products p on p.id = i.product_id
  where i.business_id = p_business_id
    and (p_branch_id is null or i.branch_id = p_branch_id)
    and p.business_id in (select auth.user_business_ids())
    and i.quantity <= p.reorder_level
    and p.is_active = true
  order by i.quantity asc;
$$;
grant execute on function low_stock_items to authenticated;
```

### 6.6 `expiring_batches` — Pharmacy / agro-vet alerts

```sql
create or replace function expiring_batches(p_business_id uuid, p_days int default 30)
returns setof product_batches
language sql stable security definer set search_path = public as $$
  select * from product_batches
  where business_id = p_business_id
    and business_id in (select auth.user_business_ids())
    and quantity > 0
    and expiry_date is not null
    and expiry_date <= current_date + (p_days || ' days')::interval
  order by expiry_date asc;
$$;
grant execute on function expiring_batches to authenticated;
```

---

## 7. Triggers

### 7.1 `updated_at` maintenance

```sql
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_products_updated  before update on products
  for each row execute function touch_updated_at();
create trigger trg_inventory_updated before update on inventory
  for each row execute function touch_updated_at();
create trigger trg_businesses_updated before update on businesses
  for each row execute function touch_updated_at();
```

### 7.2 Auto-create profile + owner business membership on signup

```sql
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''),
          new.phone);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

### 7.3 Audit trigger (apply to sensitive tables)

```sql
create or replace function audit_changes()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_biz uuid;
begin
  v_biz := coalesce(new.business_id, old.business_id);
  insert into audit_log(business_id, user_id, action, entity_type, entity_id, before_data, after_data)
  values (
    v_biz, auth.uid(),
    tg_op || '.' || tg_table_name, tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end; $$;

create trigger trg_audit_products      after insert or update or delete on products
  for each row execute function audit_changes();
create trigger trg_audit_sales         after update on sales
  for each row execute function audit_changes();
create trigger trg_audit_members       after insert or update or delete on business_members
  for each row execute function audit_changes();
```

### 7.4 Low-stock realtime notification

```sql
create or replace function notify_low_stock()
returns trigger language plpgsql as $$
declare v_reorder int;
begin
  select reorder_level into v_reorder from products where id = new.product_id;
  if new.quantity <= v_reorder and (old.quantity is null or old.quantity > v_reorder) then
    perform pg_notify('low_stock', json_build_object(
      'business_id', new.business_id,
      'branch_id', new.branch_id,
      'product_id', new.product_id,
      'quantity', new.quantity
    )::text);
  end if;
  return new;
end; $$;

create trigger trg_low_stock after update of quantity on inventory
  for each row execute function notify_low_stock();
```

---

## 8. Edge Functions (Supabase / Deno)

Place under `supabase/functions/<name>/index.ts`.

### 8.1 `mpesa-stk-push`

POST → triggers an M-Pesa STK push via Safaricom Daraja, returns `CheckoutRequestID`.

```ts
// supabase/functions/mpesa-stk-push/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

const DARAJA_BASE = Deno.env.get("DARAJA_BASE")!;     // sandbox or prod
const SHORTCODE   = Deno.env.get("MPESA_SHORTCODE")!;
const PASSKEY     = Deno.env.get("MPESA_PASSKEY")!;
const CONSUMER_KEY    = Deno.env.get("MPESA_CONSUMER_KEY")!;
const CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET")!;
const CALLBACK_URL    = Deno.env.get("MPESA_CALLBACK_URL")!;

async function token() {
  const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  const r = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return (await r.json()).access_token;
}

serve(async (req) => {
  const { phone, amount, account_ref, description } = await req.json();
  const ts = new Date().toISOString().replace(/[-:.TZ]/g,"").slice(0,14);
  const password = btoa(`${SHORTCODE}${PASSKEY}${ts}`);
  const t = await token();

  const r = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: SHORTCODE, Password: password, Timestamp: ts,
      TransactionType: "CustomerPayBillOnline", Amount: amount,
      PartyA: phone, PartyB: SHORTCODE, PhoneNumber: phone,
      CallBackURL: CALLBACK_URL, AccountReference: account_ref, TransactionDesc: description
    })
  });
  return new Response(await r.text(), { headers: { "content-type": "application/json" } });
});
```

### 8.2 `mpesa-callback`

Safaricom posts here. Verifies, then calls `create_sale` (or updates a pending sale) via service-role client.

```ts
// supabase/functions/mpesa-callback/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const body = await req.json();
  const cb = body.Body?.stkCallback;
  if (!cb) return new Response("ok");
  const code = cb.CallbackMetadata?.Item
    ?.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
  const requestId = cb.CheckoutRequestID;

  await supa.from("sales")
    .update({ mpesa_code: code, status: cb.ResultCode === 0 ? "completed" : "voided" })
    .eq("mpesa_checkout_request_id", requestId);

  return new Response("ok");
});
```

### 8.3 `daily-summary-cron`

Scheduled (Supabase cron, daily 21:00 EAT). Aggregates day totals, emails owner, pushes notification.

```ts
// supabase/functions/daily-summary-cron/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async () => {
  const { data: businesses } = await supa.from("businesses").select("id, name, email");
  for (const b of businesses ?? []) {
    const { data: report } = await supa.rpc("daily_report", { p_business_id: b.id });
    // → send email via Resend / Postmark, or push via OneSignal
    console.log("report for", b.name, report);
  }
  return new Response("ok");
});
```

Schedule via `supabase/config.toml`:
```toml
[functions.daily-summary-cron]
schedule = "0 18 * * *" # 18:00 UTC = 21:00 EAT
```

### 8.4 `sync-pull` & `sync-push` — Offline sync

See §9.

---

## 9. Offline-First Sync Protocol

### 9.1 Client-side model

Each device keeps a local copy of: `products`, `inventory`, `customers`, `categories`, plus an outbound `sync_queue` for mutations made offline (mostly `sales`, `expenses`, `stock_movements`).

```ts
type QueuedMutation = {
  id: string;            // client UUID (idempotency key)
  type: 'sale' | 'expense' | 'stock_adjust';
  payload: any;
  created_at: string;
  attempts: number;
};
```

### 9.2 Pull (`sync-pull`)

Client sends `last_synced_at` per table; server returns rows updated since.

```ts
// supabase/functions/sync-pull/index.ts
serve(async (req) => {
  const { business_id, branch_id, since } = await req.json(); // since: ISO timestamp map
  const tables = ['products','inventory','customers','categories','suppliers'];
  const result: Record<string, any[]> = {};
  for (const t of tables) {
    const { data } = await supa.from(t)
      .select("*")
      .eq("business_id", business_id)
      .gt("updated_at", since[t] ?? "1970-01-01")
      .order("updated_at", { ascending: true })
      .limit(1000);
    result[t] = data ?? [];
  }
  return Response.json({ server_time: new Date().toISOString(), data: result });
});
```

### 9.3 Push (`sync-push`)

Client uploads queue; server applies each mutation idempotently using `client_uuid`.

```ts
// supabase/functions/sync-push/index.ts
serve(async (req) => {
  const { mutations } = await req.json();
  const results = [];
  for (const m of mutations) {
    try {
      if (m.type === "sale") {
        const { data } = await supa.rpc("create_sale", {
          ...m.payload,
          p_client_uuid: m.id,           // idempotency
        });
        results.push({ id: m.id, ok: true, server_id: data.id });
      } else if (m.type === "expense") {
        const { data } = await supa.from("expenses")
          .upsert({ ...m.payload, id: m.id }, { onConflict: "id" })
          .select().single();
        results.push({ id: m.id, ok: true, server_id: data.id });
      } else if (m.type === "stock_adjust") {
        await supa.rpc("adjust_stock", m.payload);
        results.push({ id: m.id, ok: true });
      }
    } catch (e: any) {
      results.push({ id: m.id, ok: false, error: e.message });
    }
  }
  return Response.json({ results });
});
```

### 9.4 Conflict rules

| Entity         | Strategy                                                            |
| -------------- | ------------------------------------------------------------------- |
| `sales`        | Idempotent by `client_uuid`; server is authoritative. Never overwritten. |
| `expenses`     | Last-write-wins on `updated_at`.                                    |
| `products`     | Server is authoritative on push pull (pricing changes from manager). |
| `inventory`    | Never sync directly — always go through `adjust_stock` / `create_sale`. |
| `customers`    | Server is authoritative; client edits merged with `updated_at`.     |

### 9.5 Receipt numbering offline

Cashier mode generates a **temporary** receipt number `TMP-{deviceId}-{seq}`. The server reassigns the official `BIZ-…` number inside `create_sale`. Client updates display once sync succeeds.

---

## 10. Realtime Channels

Enable Postgres replication on `sales`, `inventory`, `stock_movements`.

```
- channel: business:{business_id}:sales       → new sales feed for dashboard
- channel: business:{business_id}:low_stock   → triggered by notify_low_stock()
- channel: branch:{branch_id}:inventory       → live stock updates for POS
```

Client subscribes with Supabase Realtime + filters by `business_id` / `branch_id`.

---

## 11. Storage Buckets

| Bucket           | Public | Use                              | Policy                                  |
| ---------------- | ------ | -------------------------------- | --------------------------------------- |
| `product-images` | yes    | Product photos                   | Read public; write requires `is_manager`. |
| `receipts`       | no     | Scanned expense receipts         | Read/write scoped to business members.  |
| `business-logos` | yes    | Business + branch logos          | Read public; write owner only.          |
| `exports`        | no     | Generated PDF / CSV reports      | Signed URL, expires in 1h.              |

Path convention: `{business_id}/{branch_id?}/{entity_id}.{ext}`.

---

## 12. KRA / Tax Notes

* `tax_type` on each product captures VAT rate (16%, 8% for petroleum, 0% zero-rated, exempt).
* `sale_items.tax_amount` is computed VAT-inclusive (Kenyan retail convention) — i.e. `tax = line_total - (line_total / (1 + rate))`.
* `businesses.kra_pin` and `vat_number` are stored for receipts.
* Receipts must show: business name, KRA PIN, VAT number (if registered), receipt number, date/time, item list, subtotal, VAT amount, total, cashier name, payment method, M-Pesa code (if any).
* For **eTIMS** (KRA Electronic Tax Invoice Management System) integration, add `etims_invoice_number` and `etims_qr_code` columns to `sales` and call the eTIMS API from a dedicated edge function (`etims-submit`) on every completed sale. Out of scope for this initial schema but slot is reserved.

---

## 13. Indexing & Performance

Hot-path indexes already declared above. Additionally recommended:

```sql
create index on sales(business_id, status, created_at desc)
  where status = 'completed';                          -- dashboard queries
create index on sale_items(product_id, sale_id);       -- top-products reports
create index on stock_movements(branch_id, created_at desc); -- ledger views
create index on products(business_id, is_active)
  where is_active = true;                              -- catalog queries
```

For very high-volume tenants, partition `sales` and `stock_movements` by month using `pg_partman`.

---

## 14. Security Checklist

- [x] RLS enabled on every table.
- [x] `SECURITY DEFINER` RPCs verify membership before any mutation.
- [x] No direct `INSERT`/`UPDATE` on `stock_movements` — ledger writes go through RPCs only.
- [x] `auth.uid()` used everywhere; never trust client-supplied user IDs.
- [x] Foreign keys on every relationship + `on delete cascade` where the parent fully owns the child.
- [x] Idempotency on `create_sale` via `client_uuid` to make offline retries safe.
- [x] Edge function secrets (Daraja keys, service role) stored in Supabase secret vault — never shipped to client.
- [x] Audit log on sales, products, members.
- [x] Storage buckets scoped via policies, signed URLs for private content.

---

## 15. Migration File Layout

```
supabase/
├── config.toml
├── migrations/
│   ├── 20260101000000_init_extensions.sql
│   ├── 20260101000100_enums.sql
│   ├── 20260101000200_tenancy.sql           -- businesses, branches, members, profiles
│   ├── 20260101000300_catalog.sql           -- categories, products, suppliers
│   ├── 20260101000400_inventory.sql         -- inventory, batches, stock_movements
│   ├── 20260101000500_sales.sql             -- sales, sale_items
│   ├── 20260101000600_finance.sql           -- expenses, loyalty
│   ├── 20260101000700_audit.sql
│   ├── 20260101000800_rls.sql               -- helper fns + all policies
│   ├── 20260101000900_rpc_sales.sql         -- create_sale, void_sale
│   ├── 20260101001000_rpc_stock.sql         -- adjust_stock, low_stock, expiring
│   ├── 20260101001100_rpc_reports.sql       -- daily_report
│   └── 20260101001200_triggers.sql
└── functions/
    ├── mpesa-stk-push/
    ├── mpesa-callback/
    ├── daily-summary-cron/
    ├── sync-pull/
    └── sync-push/
```

---

## 16. Sample Client Call (TypeScript)

```ts
import { createClient } from '@supabase/supabase-js';
const supa = createClient(URL, ANON_KEY);

// Create a sale
const { data, error } = await supa.rpc('create_sale', {
  p_business_id: bizId,
  p_branch_id: branchId,
  p_customer_id: null,
  p_payment_method: 'mpesa',
  p_amount_paid: 480,
  p_mpesa_code: 'SFE7XYZ123',
  p_items: [
    { product_id: 'uuid-1', quantity: 2, unit_price: 230, discount: 0 },
    { product_id: 'uuid-2', quantity: 1, unit_price: 60,  discount: 0 },
  ],
  p_client_uuid: crypto.randomUUID(),
  p_discount_amount: 0,
  p_notes: null,
});
```

---

End of spec. Pair this with `DESIGN_SYSTEM.md` for the complete BizFlow KE handoff package.
