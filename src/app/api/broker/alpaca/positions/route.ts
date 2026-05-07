import { NextResponse } from "next/server";
import { getAlpacaApiConfig } from "@/lib/alpaca/config";
import { getUserAlpacaAccessToken } from "@/lib/alpaca/tokens";
import { createClient } from "@/lib/supabase/server";

type AlpacaPosition = {
  symbol: string;
  qty: string;
  side: string;
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  current_price: string;
  avg_entry_price: string;
};

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = await getUserAlpacaAccessToken(user.id);
    const { baseUrl } = getAlpacaApiConfig();
    const response = await fetch(`${baseUrl}/v2/positions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Alpaca positions" },
        { status: response.status }
      );
    }

    const positions = (await response.json()) as AlpacaPosition[];

    return NextResponse.json({
      positions: positions.map((position) => ({
        ticker: position.symbol,
        quantity: parseNumber(position.qty),
        side: position.side,
        marketValue: parseNumber(position.market_value),
        costBasis: parseNumber(position.cost_basis),
        unrealizedProfitLoss: parseNumber(position.unrealized_pl),
        unrealizedProfitLossPercent: parseNumber(position.unrealized_plpc),
        currentPrice: parseNumber(position.current_price),
        averageEntryPrice: parseNumber(position.avg_entry_price),
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch Alpaca positions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
