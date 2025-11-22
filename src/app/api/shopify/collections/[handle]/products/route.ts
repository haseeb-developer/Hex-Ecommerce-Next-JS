import { NextResponse } from "next/server";
import { getShopifyClientInstance, GET_PRODUCTS_BY_COLLECTION } from "@/lib/shopify";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  // Always return 200 to prevent frontend errors
  try {
    // Check environment variables FIRST
    const hasStoreDomain = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const hasToken = !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    if (!hasStoreDomain || !hasToken) {
      console.error("❌ Missing Shopify environment variables");
      return NextResponse.json(
        {
          error: "Shopify configuration missing",
          message: "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables are required",
          data: {
            collection: {
              products: {
                edges: []
              }
            }
          }
        },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "24");
    
    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = await Promise.resolve(params);
    const handle = resolvedParams.handle;

    if (!handle) {
      return NextResponse.json(
        { 
          error: "Collection handle is required",
          data: {
            collection: {
              products: {
                edges: []
              }
            }
          }
        },
        { status: 200 }
      );
    }

    // Create client on demand (validates env vars)
    const client = getShopifyClientInstance();
    
    const data = await client.request(GET_PRODUCTS_BY_COLLECTION, {
      handle,
      first,
    });

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
    console.error("❌ Shopify Collection Products API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch collection products",
        message: error.message || "Unknown error",
        data: {
          collection: {
            products: {
              edges: []
            }
          }
        }
      },
      { status: 200 } // Always return 200
    );
  }
}

