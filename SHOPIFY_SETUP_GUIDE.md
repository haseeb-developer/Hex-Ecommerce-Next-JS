# 🛍️ Complete Shopify Store Connection Guide

This guide will walk you through connecting your Shopify store to your Next.js ecommerce project.

## 📋 Prerequisites

- A Shopify store (you can create one at [shopify.com](https://www.shopify.com))
- Admin access to your Shopify store
- Products and collections set up in your Shopify store

## 🔧 Step-by-Step Setup

### Step 1: Get Your Shopify Store Domain

1. Log in to your Shopify admin panel
2. Your store domain is in the format: `your-store-name.myshopify.com`
3. Copy this domain (you'll need it for the environment variable)

### Step 2: Create a Shopify App

1. In your Shopify admin, go to **Settings** → **Apps and sales channels**
2. Click **Develop apps** (at the bottom)
3. Click **Allow custom app development** (if prompted)
4. Click **Create an app**
5. Give your app a name (e.g., "Next.js Storefront")
6. Click **Create app**

### Step 3: Configure API Scopes

1. In your app settings, click **Configure Admin API scopes**
2. You need to enable these scopes:
   - `read_products`
   - `read_product_listings`
   - `read_collections`
   - `read_content`
3. Click **Save**

### Step 4: Get Storefront API Access Token

1. In your app settings, click **API credentials** tab
2. Scroll down to **Storefront API** section
3. Click **Install** (if not already installed)
4. Copy the **Storefront API access token** (starts with `shpat_` or `shpca_`)
   - ⚠️ **Important**: This is different from the Admin API token
   - You need the **Storefront API** token, not the Admin API token

### Step 5: Set Up Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add your Shopify credentials:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

**Example:**
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=my-awesome-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

### Step 6: Verify Your Setup

1. Make sure your `.env.local` file is in the project root
2. Restart your Next.js development server:
   ```bash
   npm run dev
   ```
3. Check the browser console for any errors
4. Hover over the "SHOP" link in the header - you should see the mega menu with products

## 🎯 Testing the Connection

### Test Products Endpoint

Visit: `http://localhost:3000/api/shopify/products`

You should see a JSON response with your products.

### Test Collections Endpoint

Visit: `http://localhost:3000/api/shopify/collections`

You should see a JSON response with your collections.

## 🔍 Troubleshooting

### Error: "Failed to fetch products"

**Possible causes:**
1. **Wrong domain format**: Make sure it's `your-store.myshopify.com` (not `https://your-store.myshopify.com`)
2. **Wrong token**: Make sure you're using the **Storefront API** token, not the Admin API token
3. **Token not installed**: Make sure you clicked "Install" in the Storefront API section
4. **Missing scopes**: Verify the app has the correct scopes enabled

### Error: "Invalid API version"

The code uses Shopify API version `2024-01`. If you get version errors:
1. Check if your Shopify store supports this version
2. Update the version in `src/lib/shopify.ts` if needed

### Products Not Showing

1. **Check if you have products**: Make sure you have at least one product in your Shopify store
2. **Check product visibility**: Products must be available on your storefront
3. **Check collections**: Make sure collections are published and have products

## 📝 Important Notes

1. **Never commit `.env.local`**: This file contains sensitive credentials and is already in `.gitignore`
2. **Storefront API vs Admin API**: 
   - Storefront API is for public-facing data (products, collections)
   - Admin API is for managing your store (requires different setup)
3. **Rate Limits**: Shopify has rate limits. The Storefront API allows 2,000 requests per second per store.

## 🚀 Next Steps

Once connected, you can:
- Display products in the mega menu ✅ (Already implemented)
- Create product detail pages
- Implement add to cart functionality
- Create collection pages
- Add product search functionality

## 📚 Additional Resources

- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [GraphQL Explorer](https://shopify.dev/docs/api/storefront/2024-01/queries)
- [Storefront API Authentication](https://shopify.dev/docs/api/storefront#authentication)

## 🆘 Still Having Issues?

1. Check the browser console for error messages
2. Check the terminal/console where Next.js is running
3. Verify your environment variables are correct
4. Make sure your Shopify store is active and has products

---

**Need help?** Check the error messages in your console - they usually point to the exact issue!

