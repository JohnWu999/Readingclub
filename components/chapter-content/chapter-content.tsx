"use client";

import { useMemo } from "react";
import { Quote, Sparkles, BookMarked } from "lucide-react";

interface ChapterContentProps {
  content: string;
}

// 广告/无用内容过滤
const AD_PATTERNS = [
  /关注微信公众号[\s\S]{0,50}手手宝贝[\s\S]{0,50}免费获取更多育儿书/g,
  /关注微信公众号/g,
  /手手宝贝/g,
  /免费获取更多育儿书/g,
  /\(1\)\s*需求冲突[\s\S]*?\(2\)\s*价值观冲突/g,
  /\(3\)\s*第三法[\s\S]*?\(4\)\s*环境调整/g,
  /\(5\)\s*问题归属[\s\S]*?\(6\)\s*自我调整/g,
];

// 广告行判断
function isAdLine(line: string): boolean {
  const adKeywords = [
    "关注微信公众号",
    "手手宝贝",
    "免费获取更多育儿书",
  ];
  return adKeywords.some((kw) => line.includes(kw));
}

// 判断是否是重点句
function isKeySentence(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 5 || trimmed.length > 120) return false;

  // 名言引用
  const quotePatterns = [
    /[\u4e00-\u9fa5]{2,10}说[，："]/,
    /[\u4e00-\u9fa5]{2,10}写道[，："]/,
    /[\u4e00-\u9fa5]{2,10}曾言[，："]/,
    /[\u4e00-\u9fa5]{2,10}认为[，：]/,
    /纪伯伦说/,
    /克里希那穆提说/,
    /托马斯\u00b7戈登/,
    /拜伦\u00b7凯蒂/,
  ];
  if (quotePatterns.some((p) => p.test(trimmed))) return true;

  // 关键词
  const keyPhrases = [
    "重要的是",
    "关键在于",
    "本质上",
    "说到底",
    "换言之",
    "总结",
    "结论",
    "核心",
    "精髓",
    "真谛",
    "奥义",
    "这意味着",
    "由此可知",
    "不难发现",
    "显而易见",
    "值得注意的是",
    "特别需要",
    "必须明白",
    "需要理解",
    "真正的",
    "唯有",
    "只有",
    "只要",
    "如果",
    "那么",
  ];
  if (keyPhrases.some((p) => trimmed.includes(p))) return true;

  // 哲理短句（包含特定词汇且句式简洁）
  const wisdomWords = [
    "自由", "真实", "接纳", "界限", "尊重", "爱", "信任",
    "真诚", "平等", "独立", "自主", "责任", "沟通",
    "感受", "需求", "情绪", "倾听", "表达",
  ];
  const hasWisdomWord = wisdomWords.some((w) => trimmed.includes(w));
  if (hasWisdomWord && trimmed.length < 50 && !trimmed.includes("？")) return true;

  // 对比句
  const contrastPatterns = [
    /不是.*?而是/,
    /与其说.*?不如说/,
    /表面上.*?实际上/,
    /看似.*?实则/,
    /虽然.*?但是/,
  ];
  if (contrastPatterns.some((p) => p.test(trimmed))) return true;

  // 设问/反问
  const questionPatterns = [
    /为什么.*?\?$/,
    /如何.*?\?$/,
    /难道.*?\?$/,
    /何谓.*?\?$/,
    /什么是.*?\?$/,
  ];
  if (questionPatterns.some((p) => p.test(trimmed))) return true;

  // 金句式（包含冒号或破折号，且前后都有实质内容）
  if (/[：:].{5,}/.test(trimmed) && trimmed.length < 60) return true;

  return false;
}

// 解析内容块
interface ContentBlock {
  type: "heading" | "subheading" | "paragraph" | "quote" | "divider" | "list_item";
  text: string;
  isKey: boolean;
}

function parseContent(rawContent: string): ContentBlock[] {
  // 过滤广告
  let text = rawContent;
  AD_PATTERNS.forEach((p) => {
    text = text.replace(p, "");
  });

  const lines = text.split("\n");
  const blocks: ContentBlock[] = [];
  let currentParagraph = "";

  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      const trimmed = currentParagraph.trim();
      // 判断是否是引用
      if (trimmed.startsWith("\u201c") && trimmed.endsWith("\u201d")) {
        blocks.push({ type: "quote", text: trimmed, isKey: true });
      } else if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        blocks.push({ type: "quote", text: trimmed, isKey: true });
      } else if (isKeySentence(trimmed)) {
        blocks.push({ type: "paragraph", text: trimmed, isKey: true });
      } else {
        blocks.push({ type: "paragraph", text: trimmed, isKey: false });
      }
      currentParagraph = "";
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || isAdLine(line)) {
      flushParagraph();
      continue;
    }

    // Chapter 标题
    if (/^Chapter\s*\d+/i.test(line)) {
      flushParagraph();
      blocks.push({ type: "heading", text: line, isKey: false });
      continue;
    }

    // 纯中文短行（可能是小标题）
    if (/^[\u4e00-\u9fa5\d\s\uff10-\uff19]+$/.test(line) && line.length < 20 && !line.includes("。") && !line.includes("，")) {
      flushParagraph();
      blocks.push({ type: "subheading", text: line, isKey: false });
      continue;
    }

    // 情景标题
    if (/^情景[一二三四五六七八九十\d]+[：:]/.test(line)) {
      flushParagraph();
      blocks.push({ type: "subheading", text: line, isKey: false });
      continue;
    }

    // 数字标题（如 "1．中国式界限"）
    if (/^[\d\uff10-\uff19]+[\.．、]/.test(line) && line.length < 30) {
      flushParagraph();
      blocks.push({ type: "subheading", text: line, isKey: false });
      continue;
    }

    // 分割线
    if (/^[\-\*\u2014\u2500]{3,}$/.test(line)) {
      flushParagraph();
      blocks.push({ type: "divider", text: "", isKey: false });
      continue;
    }

    // 普通段落拼接
    currentParagraph += (currentParagraph ? " " : "") + line;
  }
  flushParagraph();

  return blocks;
}

export default function ChapterContent({ content }: ChapterContentProps) {
  const blocks = useMemo(() => parseContent(content), [content]);

  return (
    <article className="prose-chapter">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="text-lg font-bold text-[#2D2D2D] mt-8 mb-4 tracking-wide"
              >
                <span className="inline-block border-b-2 border-[#C9A961] pb-1">
                  {block.text}
                </span>
              </h2>
            );

          case "subheading":
            return (
              <h3
                key={index}
                className="text-sm font-bold text-[#E85D04] mt-6 mb-3 tracking-wide flex items-center gap-2"
              >
                <BookMarked size={14} className="text-[#C9A961]" />
                {block.text}
              </h3>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="my-5 pl-4 border-l-4 border-[#C9A961] bg-[#C9A961]/5 rounded-r-xl py-3 pr-4"
              >
                <div className="flex items-start gap-2">
                  <Quote size={16} className="text-[#C9A961] mt-1 flex-shrink-0" />
                  <p className="text-[15px] text-[#5C4A32] leading-relaxed font-medium italic">
                    {block.text}
                  </p>
                </div>
              </blockquote>
            );

          case "divider":
            return (
              <div key={index} className="flex items-center justify-center my-6">
                <div className="w-12 h-px bg-[#C9A961]/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A961]/40 mx-2" />
                <div className="w-12 h-px bg-[#C9A961]/30" />
              </div>
            );

          case "paragraph":
            if (block.isKey) {
              return (
                <p
                  key={index}
                  className="my-4 text-[15px] leading-[1.85] text-[#3D3D3D] bg-[#E85D04]/4 rounded-xl px-4 py-3 border-l-4 border-[#E85D04]"
                >
                  <span className="inline-flex items-start gap-1.5">
                    <Sparkles size={14} className="text-[#E85D04] mt-1.5 flex-shrink-0" />
                    <span className="font-medium">{block.text}</span>
                  </span>
                </p>
              );
            }
            return (
              <p
                key={index}
                className="my-4 text-[15px] leading-[1.85] text-[#4A4A4A] indent-8"
              >
                {block.text}
              </p>
            );

          default:
            return null;
        }
      })}

      {/* 全局样式补充 */}
      <style>{`
        .prose-chapter {
          font-family: "Noto Serif SC", "PingFang SC", "Microsoft YaHei", serif;
        }
        .prose-chapter p {
          text-align: justify;
          word-break: break-word;
        }
        .prose-chapter p:first-of-type::first-letter {
          font-size: 2.2em;
          float: left;
          line-height: 1;
          margin-right: 4px;
          margin-top: 2px;
          font-weight: bold;
          color: #E85D04;
        }
      `}</style>
    </article>
  );
}
