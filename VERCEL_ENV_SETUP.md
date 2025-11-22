# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Required for Production

**If products and collections don't show in production, it's because these environment variables are missing in Vercel.**

## Required Environment Variables

You **MUST** add these environment variables in your Vercel project settings:

### Steps to Add Environment Variables in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add these two variables:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- **Value:** `your-store.myshopify.com` (replace with your actual store domain)
- **Environment:** Select all (Production, Preview, Development)

#### Variable 2:
- **Name:** `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Value:** `your-storefront-access-token` (replace with your actual token)
- **Environment:** Select all (Production, Preview, Development)

6. Click **Save** for each variable

### Important Notes:

- **NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN**: 
  - Your Shopify store domain (e.g., `mystore.myshopify.com`)
  - ❌ Do NOT include `https://` or `www.`
  - ✅ Just the domain: `mystore.myshopify.com`

- **NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN**: 
  - Your Shopify Storefront API access token
  - Get this from: 
    1. Shopify Admin → Settings → Apps and sales channels
    2. Click "Develop apps" (or "Manage private apps" in older versions)
    3. Create a new app or select existing
    4. Go to "API credentials" tab
    5. Under "Storefront API", copy the "Storefront API access token"

### After Adding Variables:

1. **Go to Deployments tab** in Vercel
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete
5. **Clear your browser cache** and refresh the page
6. Open browser console (F12) and check for:
   - ✅ "Products loaded: X" message
   - ✅ "Collections loaded: X" message
   - ❌ Any error messages (they will tell you what's wrong)

### How to Verify It's Working:

1. Open your deployed site
2. Open browser console (F12 → Console tab)
3. Look for these messages:
   - `🔄 Fetching products from API...`
   - `📦 Products API Response: {...}`
   - `✅ Products loaded: X`
   - `✅ Collections loaded: X`

### Troubleshooting:

**If you see "Shopify configuration missing" error:**
- Environment variables are not set in Vercel
- Go back to Settings → Environment Variables and verify they're there
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding

**If you see "Failed to fetch" or network errors:**
- Check Vercel deployment logs (Deployments → Click deployment → Functions tab)
- Verify your Shopify store domain is correct
- Verify your Storefront API token is valid

**If products/collections are empty:**
- Check browser console for detailed error messages
- Verify your Shopify store has products and collections published
- Make sure Storefront API has read permissions

### Quick Test:

After redeploying, check the browser console. You should see:
```
🔄 Fetching products from API...
📦 Products API Response: {data: {products: {...}}}
✅ Products loaded: 24
✅ Collections loaded: 5
```

If you see errors instead, the console will tell you exactly what's wrong!

