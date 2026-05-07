import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { decryptToken } from "@/lib/alpaca/crypto";

type StoredAlpacaTokens = {
  alpaca_access_token: string | null;
  alpaca_refresh_token: string | null;
};

export async function getUserAlpacaAccessToken(userId: string): Promise<string> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("users")
    .select("alpaca_access_token, alpaca_refresh_token")
    .eq("id", userId)
    .maybeSingle<StoredAlpacaTokens>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.alpaca_access_token) {
    throw new Error("Alpaca account is not connected");
  }

  return decryptToken(data.alpaca_access_token);
}
