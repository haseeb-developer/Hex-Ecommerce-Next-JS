# 🚀 Quick Shopify Connection Steps

## Step 1: Enable Legacy Custom App Development

1. On the page you're currently viewing, scroll down to the **"Build legacy custom apps"** section
2. Click the button **"Allow legacy custom app development"**
3. This will enable the ability to create custom apps

## Step 2: Create Your Custom App

1. After clicking "Allow legacy custom app development", you'll be redirected or see a new section
2. Click **"Create an app"** or **"Create custom app"**
3. Give your app a name (e.g., "Next.js Storefront" or "My Ecommerce Store")
4. Enter your email (optional but recommended)
5. Click **"Create app"**

## Step 3: Configure Storefront API

1. Once your app is created, you'll see tabs like:
   - **Overview**
   - **API credentials**
   - **Configuration**
   - etc.

2. Click on the **"API credentials"** tab

3. Scroll down to find the **"Storefront API"** section

4. Click **"Install"** or **"Configure"** next to Storefront API

5. You'll see a list of scopes - make sure these are enabled:
   - ✅ `unauthenticated_read_product_listings` (usually auto-enabled)
   - ✅ `unauthenticated_read_product_inventory` (if you need inventory)
   - ✅ `unauthenticated_read_collection_listings` (for collections)

6. Click **"Save"** or **"Install"**

## Step 4: Get Your Access Token

1. After installing, you'll see your **Storefront API access token**
2. It will be a long string starting with `shpat_` or `shpca_`
3. **COPY THIS TOKEN** - you'll need it in the next step
4. ⚠️ **Important**: Copy the **Storefront API** token, NOT the Admin API token

## Step 5: Get Your Store Domain

1. Look at the top of your Shopify admin panel
2. Your store domain is in the URL or at the top
3. It will be in format: `your-store-name.myshopify.com`
4. **COPY THIS DOMAIN**

## Step 6: Add to Your Next.js Project

1. In your project root, create a file called `.env.local` (if it doesn't exist)

2. Add these two lines (replace with YOUR values):

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

**Example:**
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=my-awesome-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

3. **Save the file**

4. **Restart your Next.js dev server:**
   - Stop it (Ctrl+C)
   - Run `npm run dev` again

## Step 7: Test It!

1. Open your browser and go to: `http://localhost:3000`
2. Hover over the **"SHOP"** link in the header
3. You should see the mega menu with your products! 🎉

## ⚠️ Troubleshooting

### If you don't see "Storefront API" section:
- Make sure you clicked "Install" or "Configure" for Storefront API
- Some stores need to enable it first

### If you get "Failed to fetch products":
- Double-check your `.env.local` file has the correct values
- Make sure there's no extra spaces
- Make sure you're using the **Storefront API** token, not Admin API token
- Restart your dev server after adding environment variables

### If the token doesn't work:
- Make sure you copied the entire token (they're long!)
- Check that the Storefront API is properly installed in your app settings

## 🎯 What You Should See

After setup, when you hover over "SHOP":
- A beautiful mega menu slides down
- Your products appear in a grid
- Collections appear on the left side
- Everything is animated smoothly!

---

**Need more help?** Check the full guide in `SHOPIFY_SETUP_GUIDE.md`

