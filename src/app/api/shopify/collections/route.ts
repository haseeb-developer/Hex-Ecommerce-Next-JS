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

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error("Shopify API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch collections",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

