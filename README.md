
# 🇰🇪 BizFlow KE

**All-in-one Business Operating System for Kenyan SMEs**

BizFlow KE is a modern, offline-first SaaS platform that helps small and medium businesses in Kenya manage sales, inventory, branches, and payments — all in one place.

Built for shops, pharmacies, agro-vets, restaurants, and retail businesses.

---

## 🚀 Features

- 🧾 Point of Sale (POS) system (offline-first)
- 📦 Inventory & stock management
- 🏪 Multi-branch support
- 💳 M-Pesa payment integration (Daraja-ready)
- 📊 Sales analytics & reports
- ⚠️ Low stock & expiry alerts
- 👥 Role-based access (Owner, Manager, Cashier)
- 🇰🇪 VAT/KRA-ready financial tracking
- 📱 Mobile-first cashier app

---

## 🧠 Tech Stack

- **Frontend (Admin Dashboard):** Next.js + Tailwind + ShadCN UI
- **Mobile App (POS):** Flutter 3.24+
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **State Management:** Riverpod / Bloc (Flutter)
- **Charts:** Recharts / fl_chart
- **Monorepo:** Turborepo

---

## 🏗️ Architecture

- Multi-tenant SaaS (business-based isolation)
- Offline-first POS sync engine
- Edge Functions for payments + automation
- Row Level Security (RLS) for full data protection

---

## 📂 Project Structure


bizflow-ke/
├── apps/
│ ├── mobile/ # Flutter POS app
│ ├── admin/ # Web dashboard
│ └── landing/ # Marketing site
│
├── packages/
│ ├── ui/ # Design system components
│ ├── sdk/ # Supabase API client
│ └── core/ # Shared business logic
│
├── supabase/
│ ├── migrations/ # Database schema
│ ├── functions/ # Edge Functions
│
├── docs/ # System documentation


---

## ⚙️ Getting Started

### 1. Clone the repo

git clone https://github.com/YOUR_USERNAME/bizflow-ke.git
cd bizflow-ke
2. Install dependencies
npm install
3. Setup environment variables

Copy .env.example and configure:

SUPABASE_URL=
SUPABASE_ANON_KEY=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
4. Run the project
npm run dev
💡 Vision

To become the #1 SME business operating system in Africa, empowering small businesses with tools previously only available to large enterprises.

🇰🇪 Built For Kenya

Designed specifically for:

Retail shops 🏪
Pharmacies 💊
Agro-vets 🌾
Restaurants 🍽️
Small wholesalers 📦
📌 Roadmap
 Core database schema
 POS architecture design
 Flutter POS app
 M-Pesa live integration
 AI sales forecasting
 Offline sync engine v1
 SaaS billing system
🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

📄 License

MIT License © 2026 BizFlow KE


---

If you want next, I can also generate:
- 🔥 GitHub repo banner (image + branding style)
- ⚡ One-command setup script (`setup.sh`)
- 🚀 Or a fully working starter codebase pushed-ready structure

Just tell me.

