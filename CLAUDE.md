# SEED Tennis — Landing Page

Next.js 14 marketing landing page for the SEED Tennis platform. Public-facing informational site targeting players and facility operators in Saudi Arabia.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **i18n**: Built-in internationalization with Next.js middleware routing
- **Geist font** (via `next/font`)

## Quick Start

```bash
cd seed-landing-page
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint check
```

## Project Structure

```
seed-landing-page/
├── app/
│   ├── layout.tsx           # Root layout (font, metadata, providers)
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles + Tailwind base
├── components/              # Reusable UI sections and atoms
├── constants/               # Site-wide constants (features, testimonials, etc.)
├── context/                 # React context providers
├── i18n/                    # i18n configuration and helpers
├── lib/                     # Utility functions
├── messages/                # Translation message files (EN + AR)
├── middleware.ts             # Next.js middleware (locale detection + routing)
├── schemas/                 # Zod or validation schemas
├── public/                  # Static assets (images, icons)
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Internationalization

- Locale routing handled via `middleware.ts` (detects browser language, redirects to `/en` or `/ar`)
- Translation messages in `messages/` directory
- i18n configuration in `i18n/` directory
- Arabic: RTL layout support via Tailwind's `rtl:` variant or `dir` attribute

## Key Functionality

This is a **marketing/informational** site. It does not include booking flows — those live in `Facilities_webfront/` (facility-specific booking) and `frontend/` (admin panel). It should include:

- Hero section with app download CTAs (App Store + Google Play)
- Features overview (court booking, camera recording, WhatsApp notifications, multi-sport support)
- Pricing / package highlights
- Testimonials / social proof
- Contact / enquiry form
- Language toggle (EN ↔ AR)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.seedco.sa/api   # For contact form submission (if any)
```

## Deployment

Typically deployed to S3 + CloudFront alongside the admin frontend, or as a separate static export.

```bash
npm run build
# Static export (if configured in next.config.mjs):
# output goes to out/ folder → upload to S3
```

Or standard Node.js deployment:
```bash
npm run start   # Port 3000
```

## Key Documentation

| File | Topic |
|------|-------|
| `README.md` | Basic setup (Next.js boilerplate) |
| `docs/api/landing-page-api.md` | API endpoints used by this site |
