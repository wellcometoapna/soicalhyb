import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const RETRY_BASE_MS = 500;
const GEMINI_TIMEOUT_MS = 15000;

async function generateWithGemini(
  prompt: string,
  opts?: { maxRetries?: number },
) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GEMINI_API_KEY");
  }

  const maxRetries = opts?.maxRetries ?? 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p: any) => p.text)
            .join("\n") || "";
        return text as string;
      }

      const statusText = data?.error?.status || "";
      const isRetryable =
        res.status === 429 || res.status >= 500 || statusText === "UNAVAILABLE";
      if (!isRetryable || attempt === maxRetries) {
        console.error("Gemini error", data);
        throw new Error(
          data?.error?.message || `Gemini request failed (${res.status})`,
        );
      }
    } catch (err: any) {
      // AbortError or network errors are retryable until maxRetries is reached
      const isAbort = err?.name === "AbortError";
      if (attempt === maxRetries) {
        throw new Error(
          isAbort
            ? "Gemini request timed out"
            : err?.message || "Gemini request failed",
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }

    // Exponential backoff with jitter
    const backoff =
      RETRY_BASE_MS * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
    await new Promise((r) => setTimeout(r, backoff));
  }

  throw new Error("Gemini request failed after retries");
}

function extractHashtags(text: string) {
  const tags = Array.from(
    new Set((text.match(/#[A-Za-z0-9_]+/g) || []).map((t) => t.trim())),
  );
  return tags.join(" ");
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = await request.json().catch(() => ({}));
  const { type } = body || {};

  if (!type) {
    return NextResponse.json({ error: "Missing type" }, { status: 400 });
  }

  try {
    if (type === "generate") {
      const {
        topic = "",
        tone = "Professional",
        hashtags = "",
        platforms = [],
      } = body || {};
      const platformList =
        Array.isArray(platforms) && platforms.length
          ? platforms.join(", ")
          : "Facebook, Instagram, LinkedIn, Twitter/X";
      const prompt = `You are an expert social media copywriter. Write a single, compelling, SEO-optimized social media post based on the following inputs.\n\nTopic: ${topic}\nTone: ${tone}\nTarget Platforms: ${platformList}\nMust include or adapt relevant hashtags: ${hashtags}\n\nInstructions:\n- Keep it platform-agnostic but natural.\n- Make the first line a strong hook.\n- Add a concise CTA.\n- Keep it within ~150-220 words.\n- Include a relevant set of 5-8 hashtags at the end.\n\nReturn only the post text.`;

      const generated = await generateWithGemini(prompt);
      const tags = extractHashtags(generated);
      return NextResponse.json(
        { content: generated, hashtags: tags },
        { status: 200 },
      );
    }

    if (type === "best-times") {
      const { platforms = [] } = body || {};
      // Simple heuristic suggestions per platform (UTC-based). In a real app, compute from analytics.
      const now = new Date();
      const addHours = (d: Date, h: number) =>
        new Date(d.getTime() + h * 60 * 60 * 1000);

      const defaults: Record<string, number[]> = {
        facebook: [2, 6, 9], // + hours from now
        instagram: [3, 7, 10],
        linkedin: [4, 8, 12],
        twitter: [1, 5, 9],
      };

      const used =
        Array.isArray(platforms) && platforms.length
          ? platforms
          : Object.keys(defaults);
      const suggestions = used.map((p: string) => {
        const offsets = defaults[p] || [2, 6, 10];
        const next = addHours(now, offsets[0]);
        return { platform: p, iso: next.toISOString() };
      });

      return NextResponse.json({ suggestions }, { status: 200 });
    }

    if (type === "publish") {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const {
        content = "",
        hashtags = "",
        platforms = [],
        publishNow = true,
        scheduleAt = null,
      } = body || {};
      if (!content?.trim()) {
        return NextResponse.json(
          { error: "Content is required" },
          { status: 400 },
        );
      }
      if (!Array.isArray(platforms) || platforms.length === 0) {
        return NextResponse.json(
          { error: "At least one platform is required" },
          { status: 400 },
        );
      }

      // Validate connected accounts
      const { data: accounts, error: accErr } = await supabase
        .from("social_accounts")
        .select("platform")
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (accErr) throw accErr;

      const connected = new Set((accounts || []).map((a: any) => a.platform));
      const invalid = platforms.filter((p: string) => !connected.has(p));
      if (invalid.length) {
        return NextResponse.json(
          { error: `Not connected: ${invalid.join(", ")}` },
          { status: 400 },
        );
      }

      const tagArray = (hashtags || "")
        .split(/\s+/)
        .map((t: string) => t.trim())
        .filter((t: string) => t.startsWith("#"));

      const nowIso = new Date().toISOString();
      const payload = {
        content: String(content),
        platforms: platforms as string[],
        hashtags: tagArray as string[],
        media_urls: [] as string[] | null,
        status: publishNow ? "published" : "scheduled",
        published_at: publishNow ? nowIso : null,
        scheduled_at: publishNow ? null : scheduleAt || null,
        analytics_data: null,
        user_id: user.id,
      } as const;

      const { data: inserted, error: insertErr } = await supabase
        .from("posts")
        .insert(payload)
        .select("id")
        .single();
      if (insertErr) throw insertErr;

      return NextResponse.json(
        { id: inserted?.id, status: payload.status },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
