This is a `AC Tools` project
## Requirements

```
Node.js v22.11.0+
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn run dev
# or
pnpm dev
```

Open [http://localhost:5173/](http://localhost:5173/) with your browser to see the result.

## Deployment

- Static

```bash

STAGING: yarn install -> yarn build:staging
UAT: yarn install -> yarn build:uat
PRODUCTION: yarn install -> yarn build:production
```

- After running `yarn build:staging/uat/production`, React.js will produce an `dist` folder which contains the HTML/CSS/JS assets for your application.

```
fe-thai-tuan
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.tsx
│  ├─ components
│  │  ├─ footer
│  │  │  └─ index.tsx
│  │  ├─ header
│  │  │  └─ index.tsx
│  │  └─ ui
│  │     └─ button.tsx
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ about
│  │  │  └─ index.tsx
│  │  └─ home
│  │     └─ index.tsx
│  ├─ utils
│  │  ├─ api.ts
│  │  └─ cn.ts
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ yarn.lock

```