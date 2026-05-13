import { createHash, randomUUID } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const API_KEY_PREFIX = "byzant_sk_";
const DISPLAY_PREFIX_LENGTH = 16;

type ApiKeyRow = {
  id: string;
  is_active: boolean;
};

export type GeneratedByzantApiKey = {
  rawKey: string;
  keyPrefix: string;
};

export function hashByzantApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function generateRawByzantApiKey(): string {
  return `${API_KEY_PREFIX}${randomUUID()}`;
}

export async function createByzantApiKeyForUser(params: {
  userId: string;
  email?: string | null;
  name?: string;
}): Promise<GeneratedByzantApiKey> {
  const rawKey = generateRawByzantApiKey();
  const keyHash = hashByzantApiKey(rawKey);
  const keyPrefix = rawKey.slice(0, DISPLAY_PREFIX_LENGTH);
  const supabase = createServiceRoleClient();

  const { error: userError } = await supabase.from("users").upsert(
    {
      id: params.userId,
      email: params.email ?? null,
    },
    { onConflict: "id" }
  );

  if (userError) {
    throw new Error("Failed to prepare user for API key generation");
  }

  const { error: keyError } = await supabase.from("api_keys").insert({
    user_id: params.userId,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    name: params.name ?? "Default Key",
  });

  if (keyError) {
    throw new Error("Failed to generate API key");
  }

  return { rawKey, keyPrefix };
}

export async function validateByzantApiKey(rawKey: string): Promise<boolean> {
  if (!rawKey.startsWith(API_KEY_PREFIX)) {
    return false;
  }

  const keyHash = hashByzantApiKey(rawKey);
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id,is_active")
    .eq("key_hash", keyHash)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  const key = data as ApiKeyRow;
  if (!key.is_active) {
    return false;
  }

  const { error: updateError } = await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", key.id);

  return !updateError;
}
