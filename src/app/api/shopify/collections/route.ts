import { NextResponse } from "next/server";
import { shopifyClient, GET_COLLECTIONS } from "@/lib/shopify";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "10");

    const data = await shopifyClient.request(GET_COLLECTIONS, {
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
    console.error("Shopify Collections API Error:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response,
      endpoint: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch collections",
        message: error.message,
        details: error.response?.errors || "Check environment variables",
      },
      { status: 500 }
    );
  }
}

