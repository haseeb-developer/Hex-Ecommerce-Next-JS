import { NextResponse } from "next/server";
import { getShopifyClientInstance, GET_COLLECTIONS } from "@/lib/shopify";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  // Always return 200 to prevent frontend errors
  try {
    // Check environment variables FIRST
    const hasStoreDomain = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const hasToken = !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    if (!hasStoreDomain || !hasToken) {
      console.error("❌ Missing Shopify environment variables");
      console.error("Store Domain:", hasStoreDomain ? "Set" : "MISSING");
      console.error("Access Token:", hasToken ? "Set" : "MISSING");
      return NextResponse.json(
        {
          error: "Shopify configuration missing",
          message: "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables are required",
          data: {
            collections: {
              edges: []
            }
          }
        },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "10");

    console.log("🔍 Fetching collections from Shopify...");
    
    // Create client on demand (validates env vars)
    const client = getShopifyClientInstance();
    
    const data = await client.request(GET_COLLECTIONS, {
      first,
    });
    
    console.log("✅ Collections fetched successfully:", data?.collections?.edges?.length || 0);

    // Return data in consistent format
    return NextResponse.json(
      { data },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    // Catch ALL errors and return 200 with empty data
    console.error("❌ Shopify Collections API Error:", error);
    console.error("Error message:", error.message);
    
    return NextResponse.json(
      {
        error: "Failed to fetch collections",
        message: error.message || "Unknown error",
        data: {
          collections: {
            edges: []
          }
        }
      },
      { status: 200 } // Always return 200
    );
  }
}

