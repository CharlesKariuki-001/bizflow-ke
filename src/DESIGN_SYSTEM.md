

# BizFlow KE - Design System & Component Library

BizFlow KE is an all-in-one SME Business OS for Kenyan small businesses (shops, pharmacies, agro-vets, restaurants). The design language is professional but warm, trustworthy, and reflects modern African tech.

## 🎨 Brand & Color Palette

The color palette is inspired by the Kenyan flag, modernized for a digital interface.

*   **Primary Brand (Green):** `#006400` (Deep Kenyan Green). Used for primary actions, active states, and brand identity.
    *   *Soft Variant:* `#0a7a3a` (Used for hover states and secondary elements).
*   **Accent (Red):** `#C8102E` (Kenyan Flag Red). Used for destructive actions, alerts, and negative trends.
*   **Highlight (Gold):** `#F2C94C`. Used for warnings, special badges, and warm highlights.
*   **Neutrals (Light Mode):**
    *   Background: `#FBFAF7` (Cream-tinted white for warmth)
    *   Surface: `#FFFFFF` (Pure white for cards)
    *   Text: `#1A1A1A` (Near black for readability)
    *   Muted: `#6B7280` (Gray for secondary text)
*   **Neutrals (Dark Mode):**
    *   Background: `#0F1410` (Deep warm dark, not pure black)
    *   Surface: `#1A211C` (Slightly lighter dark for cards)
    *   Text: `#F5F5F4` (Off-white for readability)
    *   Muted: `#9CA3AF` (Gray for secondary text)

## 🔤 Typography

We use a modern, clean typography pairing that ensures readability while maintaining a distinct character.

*   **Display/Headings:** `Poppins` (Weights: 500, 600, 700). Used for all headings (h1-h6) and prominent numbers. It provides a friendly, geometric, and modern feel.
*   **Body/UI:** `Inter` (Weights: 400, 500, 600). Used for all body text, buttons, inputs, and data tables. Highly legible for dense information.

## ✨ UI Trends & Cultural Touches

*   **Glassmorphism:** Used for cards and floating elements (`.glass-card`). It creates a sense of depth and modernity.
    *   *Light Mode:* Semi-transparent white with backdrop blur and soft shadow.
    *   *Dark Mode:* Semi-transparent dark green/gray with backdrop blur and stronger shadow.
*   **Soft Shadows:** Diffuse, warm-toned shadows (`shadow-soft-sm`, `shadow-soft`, `shadow-soft-lg`) to lift elements off the background without harsh lines.
*   **Kenyan Pattern:** A very subtle (3-5% opacity) geometric pattern (`.bg-kenya-pattern`) applied to the main background. It's inspired by Kitenge and Maasai motifs (triangles, diamonds) to add a localized, warm feel without distracting from the content.

## 🧩 Component Library

### 1. Button (`<Button />`)
A versatile button component with multiple variants and states.
*   **Variants:** `primary` (Solid Green), `secondary` (Surface color with border), `outline` (Green border), `ghost` (Transparent), `danger` (Solid Red).
*   **Sizes:** `sm`, `md`, `lg`.
*   **Features:** Supports `isLoading` state (shows spinner), `leftIcon`, and `rightIcon`.

### 2. Input (`<Input />`)
Standard text input for forms.
*   **Features:** Supports `label`, `error` message (turns border red), and `leftIcon` (e.g., for search or email icons).

### 3. Card (`<Card />`)
Container for grouping related content.
*   **Variants:** Standard (solid background) or `glass` (glassmorphism effect).
*   **Sub-components:** `<CardHeader>`, `<CardTitle>`, `<CardContent>`.

### 4. Layout (`<Layout />`)
The main application shell for authenticated users.
*   **Features:** Responsive sidebar (collapses to a hamburger menu on mobile), top navigation bar on mobile, theme toggle, and user logout.

## 📱 Screens Implemented

1.  **Login:** A welcoming entry point with the subtle Kenyan pattern, glassmorphism card, and clear branding.
2.  **Dashboard:** A high-level overview with KPI cards (Sales, Customers, M-Pesa payments), a revenue chart placeholder, and recent transactions.
3.  **POS (Point of Sale):** A split-screen interface optimized for quick checkout. Left side shows a searchable product grid; right side shows the current cart, totals, and payment methods (Cash, M-Pesa, Card).
4.  **Inventory:** A data table view for managing products, showing stock levels, pricing, and status badges.
5.  **Reports:** Visual representations of business performance, including revenue trends, sales by category, and top-selling products.

## 💡 Logo & App Icon Ideas

*   **Idea 1 (Geometric):** A stylized, interlocking 'B' and 'F' using geometric shapes inspired by African patterns, colored in the brand green and gold.
*   **Idea 2 (Growth):** A rising bar chart that subtly morphs into an acacia tree silhouette, representing business growth rooted in the local environment.
*   **Idea 3 (Abstract):** A continuous flowing line (representing 'Flow') that forms a shield shape (representing security and trust), using the Kenyan flag colors.
*   **App Icon:** A simplified version of the logo on a solid `brand-green` background, ensuring high contrast and recognizability on mobile home screens.

