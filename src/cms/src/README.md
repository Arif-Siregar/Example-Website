This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisites
```
1. psql
2. Supabase(https://supabase.com/docs/guides/self-hosting/docker)(follow until Accessing Postgres to validate installation)

```

## Configuration
```
Edit env_example
cp env_example .env
```

## Initializing database
```
yarn prisma validate
yarn prisma migrate dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## folder structure

 app: `next.js` app router folder, used by another team
 pages: `next.js` pages router folder, used by our team
 prisma: Database schema folder
 components: Reuseable react components files
 public: public files like `favicon` etc
 styles: css files

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

