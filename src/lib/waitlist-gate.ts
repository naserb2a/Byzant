import { createClient } from "@supabase/supabase-js";

export async function isEmailWaitlisted(
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  try {
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}
