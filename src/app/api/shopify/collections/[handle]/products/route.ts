import { NextResponse } from "next/server";
import { shopifyClient, GET_PRODUCTS_BY_COLLECTION } from "@/lib/shopify";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "24");
    
    // Handle both sync and async params (Next.js 13+ vs 15+)
    const resolvedParams = await Promise.resolve(params);
    const handle = resolvedParams.handle;

    if (!handle) {
      return NextResponse.json(
        { error: "Collection handle is required" },
        { status: 400 }
      );
    }

    const data = await shopifyClient.request(GET_PRODUCTS_BY_COLLECTION, {
      handle,
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
        error: "Failed to fetch collection products",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

