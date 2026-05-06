/**
 * Test script: verify MiniMax API is working
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

(async () => {
  const baseURL = process.env.MINIMAX_CN_BASE_URL || "https://api.minimaxi.com/v1";
  const apiKey = process.env.MINIMAX_CN_API_KEY;
  const model = "MiniMax-M2.7-highspeed";

  console.log("Testing MiniMax API...");
  if (!apiKey || apiKey.length < 10) {
    console.log("❌ No MINIMAX_CN_API_KEY configured");
    process.exit(1);
  }

  try {
    const start = Date.now();
    const resp = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
      process.exit(1);
    }
    const content = data.choices?.[0]?.message?.content || "";
    console.log(`✅ SUCCESS (${cost}ms)`);
    console.log(`回复: ${content.replace(/<think>[\s\S]*?<\/think>/g, "").trim()}`);
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    process.exit(1);
  }
})();
