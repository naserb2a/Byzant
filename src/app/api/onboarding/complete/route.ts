import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";

type UserType = "hosted" | "byo";
type SelectedModel = "claude" | "gpt4" | "gemini" | "grok" | "openclaw" | "other";

type OnboardingCompleteRequest = {
  userType?: unknown;
  selectedModel?: unknown;
};

const USER_TYPES = new Set<UserType>(["hosted", "byo"]);
const SELECTED_MODELS = new Set<SelectedModel>([
  "claude",
  "gpt4",
  "gemini",
  "grok",
  "openclaw",
  "other",
]);

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as OnboardingCompleteRequest;
    const userType =
      typeof body.userType === "string" && USER_TYPES.has(body.userType as UserType)
        ? (body.userType as UserType)
        : null;
    const selectedModel =
      typeof body.selectedModel === "string" &&
      SELECTED_MODELS.has(body.selectedModel as SelectedModel)
        ? (body.selectedModel as SelectedModel)
        : null;

    if (!userType || !selectedModel) {
      return NextResponse.json(
        { error: "Invalid onboarding selection" },
        { status: 400 }
      );
    }

    const serviceRole = createServiceRoleClient();
    const { error } = await serviceRole.from("users").upsert(
      {
        id: user.id,
        email: user.email,
        user_type: userType,
        selected_model: selectedModel,
        onboarding_complete: true,
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to complete onboarding";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
