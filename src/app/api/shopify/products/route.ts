import { NextResponse } from "next/server";
import { shopifyClient, GET_PRODUCTS } from "@/lib/shopify";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          error: "Shopify configuration missing",
          message: "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables are required",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "12");

    const data = await shopifyClient.request(GET_PRODUCTS, {
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
    console.error("Shopify API Error:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response,
      endpoint: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error.message,
        details: error.response?.errors || "Check console for more details",
      },
      { status: 500 }
    );
  }
}

