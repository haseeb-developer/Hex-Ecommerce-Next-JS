import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Webhook secret for verification (optional but recommended)
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = request.headers.get("x-shopify-topic") || "";
    const shop = request.headers.get("x-shopify-shop-domain") || "";

    console.log(`🔔 Webhook received: ${topic} from ${shop}`);

    // Verify webhook (optional - add HMAC verification for production)
    // For now, we'll trust the webhook and revalidate

    // Revalidate relevant paths based on webhook topic
    if (topic.includes("product")) {
      // Product created, updated, or deleted
      revalidatePath("/api/shopify/products");
      revalidatePath("/api/shopify/collections");
      console.log("✅ Revalidated products and collections");
    } else if (topic.includes("collection")) {
      // Collection created, updated, or deleted
      revalidatePath("/api/shopify/collections");
      revalidatePath("/api/shopify/products");
      console.log("✅ Revalidated collections and products");
    } else if (topic.includes("page")) {
      // Page created, updated, or deleted
      revalidatePath("/api/shopify/pages");
      console.log("✅ Revalidated pages");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Webhook processed",
      topic,
      shop 
    });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { 
        error: "Webhook processing failed", 
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification (Shopify sometimes sends GET requests)
export async function GET(request: Request) {
  return NextResponse.json({ 
    message: "Shopify webhook endpoint is active",
    status: "ok" 
  });
}

