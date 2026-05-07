import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALPACA_AUTHORIZE_URL = "https://app.alpaca.markets/oauth/authorize";
const STATE_COOKIE = "byzant_alpaca_oauth_state";

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

    const clientId = process.env.ALPACA_CLIENT_ID;
    const redirectUri = process.env.ALPACA_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Alpaca OAuth environment is not configured" },
        { status: 500 }
      );
    }

    const state = crypto.randomUUID();
    const authorizationUrl = new URL(ALPACA_AUTHORIZE_URL);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("scope", "trading data");
    authorizationUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      maxAge: 10 * 60,
      path: "/",
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to start Alpaca OAuth flow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
