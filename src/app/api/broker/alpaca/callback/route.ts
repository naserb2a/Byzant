import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";
import { encryptToken } from "@/lib/alpaca/crypto";
import { getAlpacaOAuthConfig } from "@/lib/alpaca/config";

const ALPACA_TOKEN_URL = "https://api.alpaca.markets/oauth/token";
const STATE_COOKIE = "byzant_alpaca_oauth_state";

type AlpacaTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

async function exchangeCodeForTokens(code: string): Promise<{
  accessToken: string;
  refreshToken: string | null;
}> {
  const { clientId, clientSecret, redirectUri } = getAlpacaOAuthConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  const response = await fetch(ALPACA_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const tokenResponse = (await response.json()) as AlpacaTokenResponse;

  if (!response.ok) {
    throw new Error(
      tokenResponse.error_description ??
        tokenResponse.error ??
        "Failed to exchange Alpaca authorization code"
    );
  }

  if (!tokenResponse.access_token) {
    throw new Error("Alpaca token response was missing an access token");
  }

  return {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token ?? null,
  };
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${STATE_COOKIE}=`))
    ?.split("=")[1];

  const failureRedirect = NextResponse.redirect(
    `${origin}/onboarding?error=broker_failed`
  );
  failureRedirect.cookies.delete(STATE_COOKIE);

  if (!code || !state || !storedState || state !== storedState) {
    return failureRedirect;
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return failureRedirect;
    }

    const { accessToken, refreshToken } = await exchangeCodeForTokens(code);
    const serviceRole = createServiceRoleClient();
    const { error } = await serviceRole.from("users").upsert(
      {
        id: user.id,
        email: user.email,
        alpaca_access_token: encryptToken(accessToken),
        alpaca_refresh_token: refreshToken ? encryptToken(refreshToken) : null,
        broker_connected: true,
      },
      { onConflict: "id" }
    );

    if (error) {
      throw new Error(error.message);
    }

    const successRedirect = NextResponse.redirect(`${origin}/dashboard`);
    successRedirect.cookies.delete(STATE_COOKIE);
    return successRedirect;
  } catch {
    return failureRedirect;
  }
}
