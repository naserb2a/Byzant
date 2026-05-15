import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isEmailWaitlisted } from "@/lib/waitlist-gate";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await isEmailWaitlisted(user.email);
  return NextResponse.json({ allowed, email: user.email });
}
