## Adding shadcn library
1. npx shadcn@latest init
2. pick the neutral color
3. to use any component u need to download it first using cli

## Adding fontawesome
1. npm i @fortawesome/fontawesome-free
2. import '@fortawesome/fontawesome-free/css/all.min.css' in `app/layout.tsx`

<!--? you need to download this to import css modules in ur ts files-->
1. npm install --save-dev @types/css-modules

## Install RHF, Zod
1. npm i react-hook-form zod @hookform/resolvers

## Adding shadcn form 
npx shadcn@latest add form

## Next Auth
1. npm i next-auth --legacy-peer-deps
2. npx auth secret `It will generates a secret key in .env.local file`