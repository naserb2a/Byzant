import { NextResponse } from "next/server";
import { getAlpacaApiConfig } from "@/lib/alpaca/config";
import { getUserAlpacaAccessToken } from "@/lib/alpaca/tokens";
import { createClient } from "@/lib/supabase/server";

type AlpacaLatestTradeResponse = {
  trade?: {
    p?: number;
  };
};

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.trim().toUpperCase();

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    const accessToken = await getUserAlpacaAccessToken(user.id);
    const { dataUrl } = getAlpacaApiConfig();
    const response = await fetch(
      `${dataUrl}/v2/stocks/${encodeURIComponent(ticker)}/trades/latest`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const latestTrade = (await response.json()) as AlpacaLatestTradeResponse;

    if (!response.ok || typeof latestTrade.trade?.p !== "number") {
      return NextResponse.json(
        { error: "Failed to fetch Alpaca price" },
        { status: response.ok ? 500 : response.status }
      );
    }

    return NextResponse.json({
      ticker,
      price: latestTrade.trade.p,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Alpaca price";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
