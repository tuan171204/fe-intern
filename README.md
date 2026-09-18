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
