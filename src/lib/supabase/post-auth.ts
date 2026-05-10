import type { SupabaseClient } from "@supabase/supabase-js";

export async function resolvePostAuthRedirect(
  supabase: SupabaseClient
): Promise<"/dashboard" | "/onboarding"> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/onboarding";

  try {
    const { data } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    return data?.onboarding_complete ? "/dashboard" : "/onboarding";
  } catch {
    return "/onboarding";
  }
}
