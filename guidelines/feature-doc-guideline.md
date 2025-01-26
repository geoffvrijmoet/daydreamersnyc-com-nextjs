# Project Overview
Use this guide to build a web app that will serve as the Shopify storefront for Daydreamers Pet Supply LLC (https://daydreamersnyc.com).

# Feature Requirements
- We will use headless Shopify to build the storefront.
- We will utilize Shopify's built-in authentication via the Storefront API.
- We will use Shopify's native database for product, customer, and order management.
- We will use Shopify's admin api to manage the store.
- The website will be hosted at https://daydreamersnyc.com.
- The website will be deployed on Vercel.
- The website code will be hosted on GitHub, at my personal account (geoffvrijmoet), on a repository called daydreamersnyc-com-nextjs.
- The web app should have lightning-fast performance.
- The entire app should be extremely mobile-friendly.
- We will use Next.js, Shadcn, Lucid, and Tailwind CSS to build the app.

# Relevant Docs
- Shopify Storefront API: https://shopify.dev/docs/api/storefront
- Shopify Customer Authentication: https://shopify.dev/docs/api/storefront/latest/mutations/customerAccessTokenCreate

# Current File Structure
📁 DAYDREAMERSNYC-COM-NEXTJS
├── 📁 app
│   ├── 📁 api
│   ├── 📁 fonts
│   ├── 📁 menu/
│   │   ├── 📁 [handle]/
│   │   │   ├── 📄 page.tsx
│   ├── 📁 sign-in/
│   │   ├── 📄 page.tsx  
│   ├── 📁 sign-up/
│   │   ├── 📄 page.tsx    
│   ├── 📁 fonts
│   ├── ⭐ favicon.ico
│   ├── 📄 globals.css
│   ├── 📄 layout.tsx
│   └── 📄 page.tsx
├── 📁 components
│   ├── 📁 ui
│   │   ├── 📄 button.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 dialog.tsx
│   │   ├── 📄 dropdown-menu.tsx
│   │   ├── 📄 form.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 label.tsx
│   │   ├── 📄 select.tsx
│   │   ├── 📄 sheet.tsx
│   │   ├── 📄 table.tsx
│   │   └── 📄 toast.tsx
│   ├── 📄 header.tsx
│   ├── 📄 footer.tsx
│   ├── 📄 product-card.tsx
│   ├── 📄 product-grid.tsx
│   ├── 📄 cart.tsx
│   ├── 📄 cart-item.tsx
│   ├── 📄 search.tsx
│   └── 📄 loading.tsx

├── 📁 guidelines
│   └── 📄 feature-doc-guideline.md
├── 📁 lib
├── 📁 node_modules
├── 📄 .cursorrules
├── 📄 .eslintrc.json
├── 📄 .gitignore
├── 📄 components.json
├── 📄 next-env.d.ts
├── 📄 next.config.mjs
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 postcss.config.mjs
├── 📄 README.md
├── 📄 tailwind.config.ts
└── 📄 tsconfig.json

# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified.
- All new pages go in /app.