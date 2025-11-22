# Shopify Webhooks Setup Guide

This guide will help you set up webhooks so your Next.js app automatically updates when you add, update, or delete products/collections in Shopify.

## 🎯 What This Does

When you make changes in Shopify Admin:
- ✅ Add a product → Appears in your Next.js app automatically
- ✅ Delete a product → Removed from your Next.js app automatically
- ✅ Update a product → Changes reflect immediately
- ✅ Add/Delete collections → Updates automatically
- ✅ Add/Delete pages → Updates automatically

## 📋 Prerequisites

1. Your Next.js app must be deployed (webhooks need a public URL)
2. For local development, use a tunneling service like ngrok

## 🚀 Setup Steps

### Step 1: Get Your Webhook URL

**For Production:**
```
https://your-domain.com/api/webhooks/shopify
```

**For Local Development (using ngrok):**
1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Your webhook URL: `https://abc123.ngrok.io/api/webhooks/shopify`

### Step 2: Configure Webhooks in Shopify

1. Go to your Shopify Admin
2. Navigate to: **Settings** → **Notifications** → **Webhooks**
3. Click **"Create webhook"**

### Step 3: Add Product Webhooks

Create these webhooks (repeat for each):

#### Product Created
- **Event**: `Product creation`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`
- Click **"Save webhook"**

#### Product Updated
- **Event**: `Product update`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`
- Click **"Save webhook"**

#### Product Deleted
- **Event**: `Product deletion`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`
- Click **"Save webhook"**

### Step 4: Add Collection Webhooks

Create these webhooks:

#### Collection Created
- **Event**: `Collection creation`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`
- Click **"Save webhook"**

#### Collection Updated
- **Event**: `Collection update`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`
- Click **"Save webhook"**

#### Collection Deleted
- **Event**: `Collection deletion`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`
- Click **"Save webhook"**

### Step 5: Add Page Webhooks (Optional)

#### Page Created
- **Event**: `Page creation`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`

#### Page Updated
- **Event**: `Page update`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`

#### Page Deleted
- **Event**: `Page deletion`
- **Format**: `JSON`
- **URL**: `https://your-domain.com/api/webhooks/shopify`

## 🧪 Testing Webhooks

1. **Test Product Creation:**
   - Go to Shopify Admin → Products
   - Create a new product
   - Check your Next.js app - it should appear within seconds!

2. **Test Product Deletion:**
   - Delete a product in Shopify
   - Check your Next.js app - it should disappear!

3. **Check Webhook Logs:**
   - In Shopify Admin → Settings → Notifications → Webhooks
   - Click on a webhook to see delivery logs
   - Green checkmark = Success ✅
   - Red X = Failed ❌

## 🔒 Security (Optional but Recommended)

For production, add webhook verification:

1. In Shopify Admin → Settings → Notifications → Webhooks
2. Copy the webhook secret
3. Add to your `.env.local`:
   ```env
   SHOPIFY_WEBHOOK_SECRET=your-webhook-secret-here
   ```

## 🐛 Troubleshooting

### Webhooks Not Working?

1. **Check URL is accessible:**
   - Visit: `https://your-domain.com/api/webhooks/shopify`
   - Should return: `{"message":"Shopify webhook endpoint is active","status":"ok"}`

2. **Check webhook delivery logs:**
   - Shopify Admin → Settings → Notifications → Webhooks
   - Click on webhook → View delivery logs
   - Check error messages

3. **For local development:**
   - Make sure ngrok is running
   - Update webhook URLs in Shopify to use ngrok URL
   - Restart ngrok if URL changes

4. **Check server logs:**
   - Look for webhook logs in your Next.js console
   - Should see: `🔔 Webhook received: products/create`

## 📝 Notes

- Webhooks work best when your app is deployed
- For local development, use ngrok or similar tunneling service
- Webhooks trigger immediately when changes are made in Shopify
- The app will automatically fetch fresh data on next page load

## ✅ You're Done!

Once set up, your Next.js app will automatically sync with Shopify:
- Add product in Shopify → Appears in app
- Delete product in Shopify → Removed from app
- Update product in Shopify → Changes reflect in app

No manual refresh needed! 🎉

