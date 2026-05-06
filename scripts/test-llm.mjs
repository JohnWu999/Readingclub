/**
 * Test script: verify LLM APIs are working
 * Run: node scripts/test-llm.mjs
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf-8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnv(join(__dirname, "../.env"));

async function testAPI(name, baseURL, apiKey, model, extraHeaders = {}) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Testing ${name} (${model})...`);
  console.log("=".repeat(50));
  if (!apiKey || apiKey.length < 10) {
    console.log(`⏭️ SKIPPED (no key configured)`);
    return null;
  }
  try {
    const start = Date.now();
    const resp = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...extraHeaders,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "你好，请用一句话介绍自己" }],
        max_tokens: 100,
      }),
    });
    const data = await resp.json();
    const cost = Date.now() - start;

    if (data.error) {
      console.log(`❌ FAILED: ${JSON.stringify(data.error)}`);
      return false;
    }
    const content = data.choices?.[0]?.message?.content || "";
    console.log(`✅ SUCCESS (${cost}ms)`);
    console.log(`回复: ${content.replace(/<think>[\s\S]*?<\/think>/g, "").trim()}`);
    return true;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    return false;
  }
}

(async () => {
  const results = {};

  // 1. MiniMax — 直接调用
  results.minimax = await testAPI(
    "MiniMax",
    process.env.MINIMAX_CN_BASE_URL || "https://api.minimaxi.com/v1",
    process.env.MINIMAX_CN_API_KEY,
    "MiniMax-M2.7-highspeed"
  );

  // 2. Kimi — 直接调用（sk-kimi key 可能失败，属于预期内）
  results.kimi = await testAPI(
    "Kimi",
    process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1",
    process.env.KIMI_API_KEY,
    "kimi-k2.5"
  );

  // 3. OpenRouter — 通过代理调用 Kimi
  results.openrouter = await testAPI(
    "OpenRouter → Kimi",
    "https://openrouter.ai/api/v1",
    process.env.OPENROUTER_API_KEY,
    "moonshotai/kimi-k2.5",
    { "HTTP-Referer": process.env.APP_URL || "", "X-Title": "犇爸书房" }
  );

  console.log(`\n${"=".repeat(50)}`);
  const ok = Object.entries(results).filter(([_, v]) => v === true).map(([k]) => k);
  const skip = Object.entries(results).filter(([_, v]) => v === null).map(([k]) => k);
  console.log(`✅ 通过: ${ok.join(", ") || "无"}`);
  console.log(`⏭️ 未配置: ${skip.join(", ") || "无"}`);
  console.log("=".repeat(50));
})();
