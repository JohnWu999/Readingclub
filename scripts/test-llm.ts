/**
 * Test script: verify both MiniMax and Kimi APIs are working
 * Run: npx tsx scripts/test-llm.ts
 */
import { askLLM } from "@/lib/llm-client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testProvider(name: "minimax" | "kimi") {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Testing ${name.toUpperCase()}...`);
  console.log("=".repeat(50));
  try {
    const start = Date.now();
    const reply = await askLLM({
      prompt: "你好！请用一句话介绍自己。",
      provider: name,
      maxTokens: 100,
    });
    const cost = Date.now() - start;
    console.log(`✅ ${name} OK (${cost}ms)`);
    console.log(`回复: ${reply}`);
  } catch (err: any) {
    console.log(`❌ ${name} FAILED: ${err.message}`);
  }
}

(async () => {
  await testProvider("minimax");
  await testProvider("kimi");
  console.log("\nDone.");
})();
