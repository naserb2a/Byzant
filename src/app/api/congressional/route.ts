import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function parsePaginationValue(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

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
    const limit = Math.min(
      parsePaginationValue(searchParams.get("limit"), DEFAULT_LIMIT),
      MAX_LIMIT
    );
    const offset = parsePaginationValue(searchParams.get("offset"), 0);
    const politician = searchParams.get("politician");
    const party = searchParams.get("party");
    const ticker = searchParams.get("ticker");

    let query = supabase
      .from("congressional_trades")
      .select("*", { count: "exact" })
      .order("trade_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (politician) {
      query = query.ilike("politician_name", `%${politician}%`);
    }

    if (party) {
      query = query.eq("party", party);
    }

    if (ticker) {
      query = query.eq("ticker", ticker.toUpperCase());
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      pagination: {
        limit,
        offset,
        count,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch congressional trade records";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
