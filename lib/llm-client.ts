/**
 * LLM Client for Reading Club
 * 支持自由切换 MiniMax / Kimi / OpenRouter
 *
 * 调用方式:
 *   import { askLLM } from '@/lib/llm-client'
 *   const reply = await askLLM({ prompt: "...", provider: "minimax" })
 *
 * 模型对比:
 *   - minimax: MiniMax-M2.7-highspeed (带 <think> 推理过程，适合深度思考)
 *   - kimi:    kimi-k2.5 (通用对话，需 OpenRouter 或 moonshot 普通 key)
 *   - openrouter: 通过 OpenRouter 调用任意模型 (万能 fallback)
 */

export type LLMProvider = "minimax" | "kimi" | "openrouter";

interface AskOptions {
  prompt: string;
  provider?: LLMProvider;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  /** OpenRouter 模型名，仅当 provider="openrouter" 时有效 */
  openrouterModel?: string;
}

const CONFIG = {
  minimax: {
    baseURL: process.env.MINIMAX_CN_BASE_URL || "https://api.minimaxi.com/v1",
    apiKey: process.env.MINIMAX_CN_API_KEY || "",
    model: "MiniMax-M2.7-highspeed",
  },
  kimi: {
    baseURL: process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1",
    apiKey: process.env.KIMI_API_KEY || "",
    model: "kimi-k2.5",
  },
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: "moonshotai/kimi-k2.5", // 默认调用 Kimi k2.5，可替换为任意模型
  },
};

export async function askLLM({
  prompt,
  provider = "minimax",
  systemPrompt = "你是一个温暖有同理心的阅读陪伴助手，擅长用引导式对话激发孩子的阅读兴趣。",
  maxTokens = 800,
  temperature = 0.7,
  openrouterModel,
}: AskOptions): Promise<string> {
  const cfg = { ...CONFIG[provider] };
  if (!cfg.apiKey) {
    throw new Error(`Missing API key for ${provider}. Check .env config.`);
  }
  if (provider === "openrouter" && openrouterModel) {
    cfg.model = openrouterModel;
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const resp = await fetch(`${cfg.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
      ...(provider === "openrouter"
        ? { "HTTP-Referer": process.env.APP_URL || "", "X-Title": "犇爸书房" }
        : {}),
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`${provider} API error (${resp.status}): ${err}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || "";

  // Strip MiniMax <think> reasoning tags if present
  return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

/** Streaming version for real-time typing effect */
export async function* askLLMStream({
  prompt,
  provider = "minimax",
  systemPrompt = "你是一个温暖有同理心的阅读陪伴助手。",
  maxTokens = 800,
  temperature = 0.7,
  openrouterModel,
}: AskOptions): AsyncGenerator<string> {
  const cfg = { ...CONFIG[provider] };
  if (provider === "openrouter" && openrouterModel) {
    cfg.model = openrouterModel;
  }

  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const resp = await fetch(`${cfg.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
      ...(provider === "openrouter"
        ? { "HTTP-Referer": process.env.APP_URL || "", "X-Title": "犇爸书房" }
        : {}),
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: true,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`${provider} API error (${resp.status}): ${err}`);
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
