# AC Tools (ACW3) – Token & NFT dApp

A frontend dApp running on **Sepolia Testnet**: sign in with your wallet (SIWE), create ERC-20 tokens through a smart contract, browse a real-time token list, and mint tokens.

## Overview

| Feature | Description |
| --- | --- |
| **Sign-In with Ethereum (SIWE)** | Connect MetaMask → sign a message → receive a JWT from the backend. |
| **Create Token** | Calls `createStandardToken` on the TokenFactory → waits for on-chain confirmation → saves metadata (image, description, social links) to the backend. |
| **Token List** | Metadata from the API + on-chain `totalSupply` / `balanceOf` (multicall, auto-refetch every ~12s). |
| **Mint Token** | Checks remaining supply and ETH balance, simulates the transaction, then calls `mint()` with the mint fee. |
| **Profile** | View / edit your profile and the tokens you created. |
| **Chain Guard** | Automatically asks the wallet to switch to Sepolia (`chainId 11155111`). |

> The NFT pages (`/nft/*`) and the Leaderboard currently use **mock data** (`src/mocks`) and are not connected to an API or contract yet.

## Tech Stack

- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS 3** (+ `tailwindcss-animate`, `class-variance-authority`)
- **Wagmi v2** + **Viem** + **@tanstack/react-query**
- **React Router v7**, **Axios**
- Web3: MetaMask (injected connector), Sepolia Testnet

## Requirements

- **Node.js** `v22.11.0+`
- **Yarn** (recommended) or npm – use **one** package manager only, so lock files don't conflict
- **MetaMask** installed in your browser
- **Sepolia ETH** to pay for gas and mint fees (get it from a faucet, e.g. Alchemy or Google Cloud Web3 Sepolia Faucet)
- **Backend API** running at `http://localhost:5035` (the dev proxy points here)
- Your own Sepolia **RPC URL** (Alchemy / Infura) – recommended, not mandatory

## Environment Variables

Create `.env.local` from the example file:

```bash
cp .env.local.example .env.local
```

```env
VITE_API_BASE_URL=/v1
VITE_ASSET_BASE_URL=
VITE_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
VITE_TOKEN_FACTORY_ADDRESS=0xa67f4aEcE759d95680A457F39A95C974Da592116
```

| Variable | Required | Description |
| --- | :---: | --- |
| `VITE_API_BASE_URL` | ✅ | API base URL. Dev: `/v1` (Vite proxies to `localhost:5035`). Production: full URL, e.g. `https://api.example.com/v1`. |
| `VITE_ASSET_BASE_URL` | ❌ | Domain serving uploaded images. Leave **empty** in dev (goes through the `/uploads` proxy). Production: the backend domain, e.g. `https://api.example.com`. |
| `VITE_SEPOLIA_RPC` | ❌ | Your own RPC. If empty or left as `YOUR_ALCHEMY_API_KEY`, the app falls back to public RPCs (easily rate-limited). |
| `VITE_TOKEN_FACTORY_ADDRESS` | ✅ | TokenFactory contract address on Sepolia. If missing or malformed, the app throws an error on startup. |

> `VITE_*` variables are embedded in the bundle at build time, so **never put secrets here**. Restart the dev server after editing `.env.local`.

## Getting Started

**1. Clone the repo**

```bash
git clone <repo-url>
cd fe-thai-tuan
```

**2. Install dependencies**

```bash
yarn install
# or
npm install
```

**3. Configure the environment**

```bash
cp .env.local.example .env.local
# Open .env.local and fill in VITE_SEPOLIA_RPC (your API key)
```

**4. Start the backend** at `http://localhost:5035` (separate repo).

**5. Start the dev server**

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), click **Connect Your Wallet**, choose MetaMask, and sign the message to log in.

## Scripts

| Yarn | npm | Description |
| --- | --- | --- |
| `yarn dev` | `npm run dev` | Start the dev server (proxies `/v1` and `/uploads` → `localhost:5035`). |
| `yarn build` | `npm run build` | Type-check (`tsc -b`) and build for production into `dist/`. |
| `yarn lint` | `npm run lint` | Run ESLint on the whole project. |
| `yarn preview` | `npm run preview` | Serve the production build locally. |

## Deployment

```bash
yarn install
yarn build
```

The output is in `dist/` (static HTML/CSS/JS) and can be hosted on Vercel, Netlify, Nginx, S3, etc.

Things to keep in mind:

- Set `VITE_API_BASE_URL`, `VITE_ASSET_BASE_URL`, `VITE_SEPOLIA_RPC` and `VITE_TOKEN_FACTORY_ADDRESS` **before building** (the Vite proxy only exists in dev).
- The app uses `BrowserRouter`, so the server must rewrite all routes to `index.html`.
- The backend must allow CORS for the frontend's domain.
- Verify the build locally with `yarn preview`.

## Troubleshooting

| Error | Fix |
| --- | --- |
| `Missing or invalid VITE_TOKEN_FACTORY_ADDRESS` | Check `.env.local`, then restart the dev server. |
| `Cannot connect to the server` | The backend isn't running on `localhost:5035`, or `VITE_API_BASE_URL` is wrong. |
| `The RPC node is rate-limiting requests` | Set your own Alchemy / Infura URL in `VITE_SEPOLIA_RPC`. |
| `Wrong network` | Click **Switch to Sepolia** or change the network in MetaMask. |
| `Not enough Sepolia ETH` | Get more ETH from a Sepolia faucet. |

## Project Structure

```text
src/
├─ api/          # Backend calls (auth, profile, token)
├─ components/   # Shared UI, layout, wallet, routing
├─ config/       # wagmi & network (Sepolia) config
├─ constants/    # ABIs, contract addresses
├─ hooks/        # useCreateToken, useMintToken, useTokenOnchainData...
├─ mocks/        # Mock data (NFT, Leaderboard)
├─ pages/        # connect, token-creator, token-list, profile...
├─ store/        # AuthContext, WalletAuthContext, ToastContext
└─ utils/        # api, validators, web3 helpers
```