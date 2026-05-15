import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isEmailWaitlisted } from "@/lib/waitlist-gate";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth?error=${encodeURIComponent(error.message)}`
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  if (!(await isEmailWaitlisted(user.email))) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/not-invited`);
  }

  let onboardingComplete = false;
  try {
    const { data } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();
    onboardingComplete = Boolean(data?.onboarding_complete);
  } catch {
    onboardingComplete = false;
  }

  return NextResponse.redirect(
    `${origin}${onboardingComplete ? "/dashboard" : "/onboarding"}`
  );
}
