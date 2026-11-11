# 9afiya (قافية) Deployment Guide

This guide walks through deploying the 9afiya Next.js application to **Vercel** (recommended) or **Cloudflare Pages**, configuring custom domains, and performing rollbacks.

---

## 1. Hosting Architecture Overview

9afiya is architected as a **static-first Next.js web application**:
- **Phases 1 & 2**: Require **zero server-side database** and **zero environment variables**. All rhyme groups, theme lists, and procedural audio synths run client-side via precomputed static JSON assets in `/public/data/`.
- Hosting cost: **$0 / month** on Vercel Hobby or Cloudflare Pages free tier.
- Edge performance: Static assets are served globally via edge CDNs with instant cache hits in Morocco and worldwide.

---

## 2. Deploying to Vercel (Recommended)

### Step 1: Connect GitHub Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub account and import `marouaneouazry/9afiya`.

### Step 2: Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automatic)
- **Install Command**: `npm ci`

### Step 3: Deploy
1. Click **Deploy**.
2. Within 60 seconds, your site will be live at `https://9afiya.vercel.app` (or similar auto-generated domain).
3. Every subsequent push or PR to `main` automatically creates an isolated preview deployment or production release.

---

## 3. Custom Domain Setup

1. In your Vercel project dashboard, go to **Settings** > **Domains**.
2. Enter your custom domain (e.g., `9afiya.ma` or `9afiya.com`).
3. Add the provided DNS records to your registrar (e.g., Cloudflare, Namecheap, or Genious Communications):
   - **Type A**: `76.76.21.21`
   - **CNAME (www)**: `cname.vercel-dns.com`
4. SSL/TLS certificates will be provisioned automatically via Let's Encrypt.

---

## 4. Rollback Strategy

If an unexpected bug or audio regression is merged into `main`:
1. In the Vercel dashboard, navigate to **Deployments**.
2. Locate the last stable deployment.
3. Click the three dots (`...`) next to that deployment and select **Instant Rollback**.
4. Traffic will immediately switch to the selected build in < 5 seconds without triggering a rebuild.

---

## 5. Rebuilding & Refreshing the Rhyme Index

When new DODa data or loanwords are added:
```bash
# 1. Fetch updated raw vocabulary
python scripts/fetch_doda.py

# 2. Rebuild precomputed JSON indexes
npm run data:build

# 3. Verify rhyme groups
npm run data:verify

# 4. Commit and push
git commit -am "data: refresh rhyme index"
git push origin feat/your-data-branch
```
