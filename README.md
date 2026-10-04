#  macOS Portfolio & Artisan Web Desktop

> A macOS-inspired interactive portfolio and web application suite built with **Nuxt 4, Vue 3, Tailwind CSS, and Supabase**.

A handcrafted desktop experience that combines a playful macOS-style UI with real applications — including a real-time iMessage-inspired chat and a complete artisan loyalty/passbook management system.

**[🌐 Live Demo](https://www.joelpinho.fr)** · **[💻 GitHub](https://github.com/raizestudio/my_portfolio)**

---

## ✨ Highlights

* 🖥️ **Interactive macOS-style desktop**
* 🪟 **Draggable, resizable, minimizable & maximizable windows**
* 🎨 **Warm Light & Dark Espresso themes**
* 🌍 **French / English internationalization**
* 💬 **Real-time Supabase chat & presence**
* ☕ **Artisan loyalty passbook / POS manager**
* 📱 **Responsive mobile experience**
* ⚡ **SSR-powered Nuxt application**
* 🚀 **Vercel deployment**

---

## 🖥️ Portfolio Desktop

The main experience recreates the feeling of using a lightweight macOS desktop directly in the browser.

### Window Manager

Applications run inside dynamically managed windows supporting:

* Drag & drop positioning
* Window resizing
* Minimize / maximize / restore
* Window stacking and z-index management
* Active application tracking
* Quick launching from the Dock
* macOS-inspired menu bar

### Dock & Menu Bar

The desktop includes:

* Live time and date
* Application shortcuts
* Active application indicators
* System-style status controls
* Responsive behavior for smaller screens

### 🎨 Global Theme Engine

A shared `useTheme()` composable controls the application's visual theme.

Available themes:

* ☀️ **Warm Light**
* 🌙 **Dark Espresso**

The selected theme is persisted through an SSR-compatible cookie:

```text
portfolio-theme
```

This allows the theme to remain consistent across navigation and server/client rendering.

### 🌍 Internationalization

The interface supports:

* 🇫🇷 French (`FR`)
* 🇬🇧 English (`EN`)

Language switching is reactive and available throughout the application.

---

## 💬 iMessage Live Chat

The portfolio includes a real-time chat application built around **Supabase Realtime**.

### Channels

Users can switch between:

```text
#general
#tech-stack
#feedback
```

### Features

* Real-time messaging
* Guest presence tracking
* Online user list
* Optimistic message rendering
* PostgreSQL persistence
* Supabase WebSocket subscriptions
* Responsive mobile channel drawer
* Overlay navigation on mobile
* iOS Safari-friendly input sizing

Messages are persisted in a Supabase PostgreSQL `messages` table while realtime subscriptions keep connected clients synchronized.

---

# ☕ Artisan Loyalty Manager

The `/fidelity` route is a standalone loyalty/passbook management application designed around an artisan coffee-shop aesthetic.

## 📖 Paper Passbook UI

The interface intentionally recreates the physical feeling of an artisan loyalty card.

The design uses:

* Cardstock-inspired surfaces
* Paper grain textures
* Dashed printed stamp wells
* Ink-style stamp seals
* Slightly imperfect rotations
* Warm coffee-shop color palettes

Stamp seals use subtle rotations such as:

```html
rotate-[-8deg]
```

to create a more physical, handcrafted appearance.

---

## 🎟️ Flexible Loyalty Goals

Customers can choose between three passbook formats:

| Pass        | Visits |
| ----------- | -----: |
| ☕ Express   |      5 |
| ⭐ Standard  |     10 |
| 👑 VIP Pass |     20 |

The system automatically tracks progress toward the selected goal.

---

## 🧾 Merchant POS

The loyalty manager also functions as a lightweight merchant dashboard.

### Customer management

* Issue new customer passbooks
* Edit customer information
* Modify rewards
* Add stamps
* Remove stamps when correcting cashier mistakes
* Claim completed passbooks

### Stamp controls

```text
+1 Stamp
-1 Stamp
```

### Dashboard metrics

The POS dashboard tracks:

* Active Customers
* Stamps Given
* Rewards Claimable
* Overall Progress

---

## 🎨 Fidelity Themes

The passbook interface supports multiple warm visual themes:

* ☕ Warm Latte
* 🧱 Terracotta
* 🍮 Roasted Caramel
* 🍵 Matcha Cream
* 🌑 Dark Mocha

---

# 🛠️ Tech Stack

| Technology          | Purpose                        |
| ------------------- | ------------------------------ |
| **Nuxt 4**          | Application framework & SSR    |
| **Vue 3**           | UI & Composition API           |
| **Tailwind CSS**    | Styling & responsive design    |
| **Supabase**        | PostgreSQL database & realtime |
| **@nuxtjs/i18n**    | Internationalization           |
| **Nitro**           | Server engine                  |
| **Vite / Rolldown** | Build tooling                  |
| **Vercel**          | Deployment                     |

---

# 🏗️ Architecture

```text
Nuxt 4
│
├── Desktop Shell
│   ├── Menu Bar
│   ├── Dock
│   ├── Window Manager
│   └── Theme Engine
│
├── Applications
│   └── ChatApp.vue
│       └── Supabase Realtime
│
├── Fidelity Manager
│   ├── Navbar
│   ├── Metrics
│   ├── Passbook Card
│   └── Customer Modal
│
└── Supabase
    ├── PostgreSQL
    └── Realtime Channels
```

---

# 📂 Project Structure

```text
.
├── components/
│   ├── apps/
│   │   └── ChatApp.vue
│   │
│   └── fidelity/
│       ├── FidelityNavbar.vue
│       ├── FidelityMetrics.vue
│       ├── FidelityCard.vue
│       └── FidelityModal.vue
│
├── composables/
│   └── useTheme.ts
│
├── pages/
│   ├── index.vue
│   └── fidelity/
│       └── index.vue
│
├── types/
│   └── database.types.ts
│
├── .gitignore
├── .npmrc
└── nuxt.config.ts
```

---

# 🚀 Getting Started

## Requirements

Make sure you have installed:

* **Node.js 20+**
* **pnpm**
* A **Supabase** project

Check your versions:

```bash
node --version
pnpm --version
```

## 1. Clone the repository

```bash
git clone https://github.com/raizestudio/my_portfolio.git
cd my_portfolio
```

## 2. Install dependencies

```bash
pnpm install
```

## 3. Configure Supabase

Create a `.env` file in the project root:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-anon-key"
```

> **Security:** The Supabase anon key is intended for client-side use. Make sure your database tables are protected with appropriate **Row Level Security (RLS)** policies and never expose a Supabase service-role key in the frontend.

## 4. Generate Supabase types

```bash
pnpm dlx supabase gen types typescript \
  --project-id "YOUR_SUPABASE_PROJECT_ID" \
  > types/database.types.ts
```

## 5. Start the development server

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 🗄️ Supabase

The project uses Supabase for:

* PostgreSQL data persistence
* Realtime messaging
* Presence tracking
* Customer/passbook data

The generated TypeScript definitions live in:

```text
types/database.types.ts
```

If you modify your database schema, regenerate the types to keep the application and database schema synchronized.

---

# 📱 Responsive Design

The application is designed to work across:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 iOS Safari

The chat application includes a mobile-specific channel drawer and uses a minimum `16px` input font size to prevent automatic Safari zoom when focusing form fields.

---

# 🚧 Roadmap

Potential future improvements:

* [ ] User authentication
* [ ] Admin authentication for the Fidelity manager
* [ ] Customer QR codes
* [ ] Printable loyalty cards
* [ ] Reward history
* [ ] Advanced merchant analytics
* [ ] PWA / installable desktop experience
* [ ] More portfolio applications
* [ ] Additional languages

---

# 📄 License

© Joel PINHO. All rights reserved.
