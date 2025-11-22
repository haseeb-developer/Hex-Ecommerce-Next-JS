# Vercel Environment Variables Setup

## Required Environment Variables

To fix the "No products found" and "No collections" issue in production, you **MUST** add these environment variables in your Vercel project settings:

### Steps to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

### Important Notes:

- **NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN**: Your Shopify store domain (e.g., `mystore.myshopify.com`)
  - Do NOT include `https://` or `www.`
  - Just the domain: `mystore.myshopify.com`

- **NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN**: Your Shopify Storefront API access token
  - Get this from: Shopify Admin → Settings → Apps and sales channels → Develop apps → Your app → API credentials → Storefront API access token

### After Adding Variables:

1. **Redeploy** your application in Vercel
2. The environment variables will be available on the next deployment
3. Check the browser console for any API errors

### Troubleshooting:

If collections/products still don't show:
1. Check Vercel deployment logs for API errors
2. Verify the environment variables are set correctly (no extra spaces, correct format)
3. Make sure your Shopify Storefront API has the correct permissions
4. Check browser console for detailed error messages

