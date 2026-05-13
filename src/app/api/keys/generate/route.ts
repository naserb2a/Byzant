import { NextResponse } from "next/server";
import { createByzantApiKeyForUser } from "@/lib/api-keys/byzant-api-keys";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = await createByzantApiKeyForUser({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      apiKey: apiKey.rawKey,
      keyPrefix: apiKey.keyPrefix,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
