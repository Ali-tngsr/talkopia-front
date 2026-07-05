# 🌈 Talkotopia — Bilingual Learning Platform

A playful, fully responsive, bilingual (English/Farsi with RTL support) learning platform frontend built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, and **shadcn/ui**.

> Built as an API-first / headless frontend with mock data — ready to swap in a real NestJS backend.

## ✨ Features

- 🌍 **Bilingual EN/FA** with dynamic RTL/LTR switching via custom i18n (API-compatible with `next-intl`)
- 📱 **Fully responsive** — mobile-first design with hamburger Sheet menu and adaptive dashboard layouts
- 🎨 **Custom Talkotopia palette** — cream, forest, sage, amber
- 🐙 **Tako mascot** — pure SVG, no external assets (anti-sanction compliant)
- 🎬 **Self-hosted video player** — no CDNs, fully styled controls
- 🧩 **8 complete pages**: Home, Courses, Course Watch, Checkout, Certificate Verification, Auth (Login/Register/OTP/Forgot), Student/Teacher/Admin Dashboards
- 📊 **Analytics dashboards** with Recharts (teacher revenue, admin finance breakdown)
- 🔐 **Auth modal** with login/register/OTP/forgot flows
- 🛒 **Cart & checkout** with coupon support (try `TAKO10`)
- 🎓 **Certificate verification** system

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| State | Zustand (with persist) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Fonts | Geist Sans / Geist Mono |

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Lint
bun run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css         # Tailwind + Talkotopia palette + utilities
│   ├── layout.tsx          # Root layout (RTL/LTR aware)
│   └── page.tsx            # Main shell with view-switching
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── talkotopia/         # Custom components
│       ├── views/          # Page-level views
│       ├── Navbar.tsx
│       ├── TakoMascot.tsx
│       ├── VideoPlayer.tsx
│       ├── CourseCard.tsx
│       ├── CourseSidebar.tsx
│       ├── AuthModal.tsx
│       ├── OTPInput.tsx
│       └── DashboardLayout.tsx
├── lib/
│   ├── i18n.tsx            # i18n provider + hooks
│   ├── store.ts            # Zustand store
│   ├── mockData.ts         # Mock data with TypeScript types
│   └── api.ts              # Simulated API with delays
└── messages/
    ├── en.json             # English translations
    └── fa.json             # Farsi translations
```

## 🧪 Try These Demo Flows

| Flow | Steps |
|---|---|
| **Browse course** | Home → click any course → watch page with video + chapters |
| **Buy a course** | Course page → "Add to Cart" → Checkout → apply coupon `TAKO10` → Pay |
| **Verify certificate** | Footer link "Verify Certificate" → enter `TKP-2026-00123` |
| **Admin panel** | Nav → Admin Panel → "Enter as Admin (demo)" → User Management |
| **Switch language** | Globe button in navbar → instant EN ↔ FA with RTL flip |

## 🔄 Migrating to Production

This frontend uses **mock data** and **view-switching** (single-page) for the sandbox demo. To migrate to your real backend:

### 1. Switch to real `next-intl`
```tsx
// Replace:
import { useTranslations, useLocale } from '@/lib/i18n';
// With:
import { useTranslations, useLocale } from 'next-intl';
```
API is identical — no other changes needed.

### 2. Multi-route structure
Move each view into `app/[locale]/<route>/page.tsx` and replace `useAppStore().navigate()` with `router.push()`.

### 3. Real API calls
In `lib/api.ts`, remove `delay()` mocks and replace with real `fetch()` calls to your NestJS backend.

### 4. Real authentication
Replace Zustand role state with NextAuth.js sessions.

## 📝 Notes

- The Tako mascot is hand-coded SVG — safe for sanctioned regions (no external asset hosts).
- All fonts are self-hosted via `next/font/google` (Geist).
- Color palette uses CSS custom properties for easy theming.

## 📄 License

MIT — free to use, modify, and distribute.

---

Made with 🌈 by the Talkotopia team.
