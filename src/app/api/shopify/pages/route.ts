import { NextResponse } from "next/server";
import { shopifyClient, GET_PAGES } from "@/lib/shopify";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "10");

    const data = await shopifyClient.request(GET_PAGES, {
      first,
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    // Check if it's an access denied error for pages
    const isAccessDenied = error.message?.includes("Access denied") || 
                         error.message?.includes("unauthenticated_read_content");
    
    if (isAccessDenied) {
      // Return empty pages array instead of error - Storefront API doesn't have page access
      console.warn("⚠️ Pages access denied - Storefront API doesn't have 'unauthenticated_read_content' scope");
      return NextResponse.json(
        {
          pages: {
            edges: []
          }
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }

    console.error("Shopify API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch pages",
        message: error.message,
        pages: {
          edges: []
        }
      },
      { status: 200 } // Return 200 with empty pages so frontend doesn't break
    );
  }
}

