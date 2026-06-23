

# BizFlow KE 🇰🇪

> Run your duka like a pro. The all-in-one Business OS for Kenyan SMEs.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made in Kenya](https://img.shields.io/badge/Made_in-Kenya-006400)

BizFlow KE is a modern, mobile-first Point of Sale (POS) and ERP system designed specifically for Kenyan small businesses (shops, pharmacies, agro-vets, and restaurants). It replaces scattered notebooks and spreadsheets with a single, beautiful interface that handles sales, inventory, M-Pesa payments, and KRA-ready reporting.

## 📸 Screenshots

*(Placeholder links for documentation)*
- `docs/screenshots/landing.png` - Conversion-focused marketing site
- `docs/screenshots/dashboard.png` - Real-time KPI dashboard with AI insights
- `docs/screenshots/pos.png` - Point of Sale with M-Pesa integration
- `docs/screenshots/receipt.png` - Thermal printer receipt preview

## ✨ Key Features

*   **Lipa na M-Pesa:** Accept payments via Till Numbers with simulated STK push and automatic reconciliation.
*   **Smart Inventory:** Track stock across multiple branches with low-stock and expiry alerts.
*   **Beautiful Reports:** Daily Z-reports, profit margins, and top sellers.
*   **Works Offline:** Sell even when the internet goes down. Auto-syncs when reconnected.
*   **Team & Roles:** Owner, manager, and cashier roles with clock-in and performance tracking.
*   **AI Insights:** Get suggestions on reordering, bundling, and pricing based on your data.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS
*   **Animations:** Framer Motion
*   **Charts:** Recharts
*   **Icons:** Lucide React
*   **Backend (Spec):** Supabase (PostgreSQL, Edge Functions, Auth) - *See `BACKEND.md`*

## 🚀 Getting Started

This repository contains the frontend prototype.

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/yourusername/bizflow-ke.git
    cd bizflow-ke
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## 📁 Documentation

*   [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI guidelines, colors, typography, and component specs.
*   [BACKEND.md](./BACKEND.md) - Complete Supabase database schema, RLS policies, and Edge Functions.
*   [DEPLOYMENT.md](./DEPLOYMENT.md) - Instructions for deploying to Vercel and setting up Supabase.

## 🗺 Roadmap

*   **Phase 1 (Done):** Core POS, Inventory, Dashboard, M-Pesa Simulation, Landing Page.
*   **Phase 2 (Q2 2026):** Live Supabase backend integration, real Daraja API connection.
*   **Phase 3 (Q4 2026):** KRA eTIMS integration, native mobile app via Capacitor.

## 💰 Pricing

*   **Free:** 1 Branch, 2 Users, 500 transactions/mo.
*   **Pro (KES 1,499/mo):** 3 Branches, 10 Users, Unlimited transactions, AI Insights.
*   **Business (KES 4,999/mo):** Unlimited everything, API access.

## 📄 License

MIT License. See `LICENSE` for details.

---
**Contact:** hello@bizflow.ke | +254 712 345 678 | Built in Nairobi 🇰🇪

