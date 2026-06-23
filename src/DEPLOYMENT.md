

# BizFlow KE — Deployment Guide

This guide covers deploying the BizFlow KE frontend to Vercel and provisioning the Supabase backend.

## 1. Prerequisites

*   Node.js 20+
*   [Vercel](https://vercel.com) account
*   [Supabase](https://supabase.com) account
*   [Safaricom Daraja](https://developer.safaricom.co.ke/) developer account (for M-Pesa)

## 2. Supabase Setup (Backend)

1.  Create a new project in the Supabase dashboard.
2.  **Database Migrations:**
    *   Install the Supabase CLI: `npm i -g supabase`
    *   Initialize the project locally: `supabase init`
    *   Link to your remote project: `supabase link --project-ref your-project-ref`
    *   Copy the SQL from `BACKEND.md` into migration files in `supabase/migrations/`.
    *   Push the migrations: `supabase db push`
3.  **Authentication:**
    *   Enable Email and Phone providers in Authentication > Providers.
4.  **Storage:**
    *   Create buckets: `product-images` (public), `receipts` (private), `business-logos` (public).
5.  **Edge Functions:**
    *   Deploy the M-Pesa and Sync functions (defined in `BACKEND.md`):
        `supabase functions deploy mpesa-stk-push`
        `supabase functions deploy mpesa-callback`
    *   Set secrets for the functions:
        `supabase secrets set MPESA_CONSUMER_KEY=... MPESA_CONSUMER_SECRET=...`

## 3. Local Development Environment

Create a `.env.local` file in the root of your React project:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# (Add other frontend-facing variables here)
```

## 4. Vercel Deployment (Frontend)

1.  Push your code to a GitHub repository.
2.  Log in to Vercel and click "Add New..." > "Project".
3.  Import your GitHub repository.
4.  **Environment Variables:** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5.  Click **Deploy**.
6.  **Custom Domain:** Go to Settings > Domains and add `bizflow.ke` (or your domain).

## 5. M-Pesa Daraja Integration

1.  Create an app on the Daraja portal.
2.  Get your Sandbox `Consumer Key` and `Consumer Secret`.
3.  Configure the `mpesa-callback` Edge Function URL as your callback URL in the Daraja portal.
4.  Once tested, apply for production credentials and update the Supabase secrets.

## 6. KRA eTIMS Integration (Phase 2)

*Integration with the Kenya Revenue Authority's Electronic Tax Invoice Management System.*
*   This will require a dedicated Edge Function (`etims-submit`) triggered upon sale completion.
*   Ensure the `tax_type` and `tax_amount` fields in the database schema are strictly adhered to.

## 7. Mobile App (Capacitor)

To package the React app for Android/iOS:
1.  `npm install @capacitor/core @capacitor/cli`
2.  `npx cap init BizFlow com.bizflow.app`
3.  `npm run build`
4.  `npx cap add android`
5.  `npx cap sync`
6.  Open in Android Studio: `npx cap open android`

## 8. Monitoring & Backups

*   **Logs:** Monitor Edge Function logs in the Supabase dashboard.
*   **Backups:** Supabase provides automated daily backups (Pro plan recommended for Point-in-Time Recovery).

