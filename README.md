## Getting Started

First, install dependencies
```bash
npm install
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables
You need to create a `.env.local` file in the root of the project and add the following variables
```bash
# Secret key for Next-Auth
# Generate one by running: npx auth secret
AUTH_SECRET=
```