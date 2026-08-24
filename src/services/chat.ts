/**
 * Client for the G-Dnyasa AI Assistant.
 *
 * All model access happens inside the `gdnyasa-chat` edge function — no API
 * keys or prompts exist in the browser bundle.
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const FUNCTION_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/gdnyasa-chat`;

const GENERIC_ERROR =
  "Sorry, I'm temporarily unable to respond. Please try again in a moment.";

export class ChatError extends Error {}

/**
 * Streams an assistant reply. `onDelta` is called with each text chunk.
 * Resolves with the complete reply text.
 */
export async function streamChatReply(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  onDelta: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  let response: Response;
  try {
    response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal,
    });
  } catch (err) {
    if ((err as Error)?.name === "AbortError") throw err;
    throw new ChatError(GENERIC_ERROR);
  }

  if (!response.ok || !response.body) {
    let msg = GENERIC_ERROR;
    try {
      const data = await response.json();
      if (typeof data?.error === "string") msg = data.error;
    } catch {
      /* keep the generic message */
    }
    throw new ChatError(msg);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed = JSON.parse(payload);
        // Only the answer channel is surfaced; reasoning deltas are ignored.
        const delta: string | undefined = parsed?.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onDelta(delta);
        }
      } catch {
        /* ignore partial/keepalive frames */
      }
    }
  }

  if (!full.trim()) throw new ChatError(GENERIC_ERROR);
  return full;
}
