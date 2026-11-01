# Vercel + MySQL Production Checklist

## Environment variables

Set these variables in Vercel for Production, Preview, and Development as needed:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE?sslaccept=strict
GEMINI_API_KEY=your-production-gemini-key
NEXTAUTH_SECRET=generate-a-long-random-secret
NEXTAUTH_URL=https://your-domain.example
```

Never commit `.env`, API keys, or database passwords. `.env.example` is safe to commit.

## Deploy

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables above.
4. Deploy with the existing build command (`next build`).
5. Run `npx prisma db push` once against the production `DATABASE_URL`, or use a reviewed Prisma migration before the first deploy.
6. Set `NEXTAUTH_URL` to the final HTTPS domain and redeploy.

## MySQL cloud

Use a managed MySQL provider with TLS, automated backups, and restricted network access. Create a least-privilege application user; do not use the root account.

## Backup

Run this from a trusted machine with the production connection details:

```bash
mysqldump --single-transaction --routines --triggers --host=HOST --user=USER --password DATABASE > backup-$(date +%F).sql
```

Store backups outside the repository, encrypt them, and test restoring one regularly. On Windows PowerShell, replace `$(date +%F)` with `Get-Date -Format yyyy-MM-dd`.

## Domain

Add the domain in Vercel, copy the DNS records Vercel provides, then update `NEXTAUTH_URL` to the HTTPS domain after DNS is active.

## Current limitation

This project does not provision cloud resources or domains automatically. Those steps require your provider accounts and credentials.
