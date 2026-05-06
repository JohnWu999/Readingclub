/**
 * LLM Client for Reading Club — MiniMax 专用
 *
 * 模型: MiniMax-M2.7-highspeed (带推理能力，适合深度思考场景)
 *
 * 使用:
 *   import { askLLM } from '@/lib/llm-client'
 *   const reply = await askLLM({ prompt: "..." })
 */

interface AskOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

const BASE_URL = process.env.MINIMAX_CN_BASE_URL || "https://api.minimaxi.com/v1";
const API_KEY = process.env.MINIMAX_CN_API_KEY || "";
const MODEL = "MiniMax-M2.7-highspeed";

export async function askLLM({
  prompt,
  systemPrompt = "你是一个温暖有同理心的阅读陪伴助手，擅长用引导式对话激发孩子的阅读兴趣。",
  maxTokens = 800,
  temperature = 0.7,
}: AskOptions): Promise<string> {
  if (!API_KEY) {
    throw new Error("Missing MINIMAX_CN_API_KEY. Check .env config.");
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const resp = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`MiniMax API error (${resp.status}): ${err}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || "";

  // Strip MiniMax <think> reasoning tags if present
  return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

/** Streaming version for real-time typing effect */
export async function* askLLMStream({
  prompt,
  systemPrompt = "你是一个温暖有同理心的阅读陪伴助手。",
  maxTokens = 800,
  temperature = 0.7,
}: AskOptions): AsyncGenerator<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const resp = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: true,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`MiniMax API error (${resp.status}): ${err}`);
  }

  const reader = resp.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const jsonStr = trimmed.slice(6);
      if (jsonStr === "[DONE]") return;

      try {
        const chunk = JSON.parse(jsonStr);
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // ignore malformed JSON
      }
    }
  }
}
