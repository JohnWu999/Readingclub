"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, ListMusic, Gauge, Volume2, X } from "lucide-react";

interface AudioChapter {
  id: string;
  title: string;
  duration: number; // seconds
  type: "HUMAN" | "AI_CLONE";
}

interface AudioPlayerProps {
  chapters: AudioChapter[];
  currentChapterId?: string;
}

const speeds = [0.5, 0.8, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ chapters, currentChapterId }: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(
    currentChapterId ? chapters.findIndex((c) => c.id === currentChapterId) : 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showList, setShowList] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = chapters[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const goToChapter = (index: number) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const nextChapter = () => {
    if (currentIndex < chapters.length - 1) {
      goToChapter(currentIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentIndex > 0) {
      goToChapter(currentIndex - 1);
    }
  };

  if (!current) return null;

  return (
    <>
      {/* 收起态迷你播放器 */}
      <div
        className="fixed bottom-16 left-0 right-0 bg-white border-t border-[#C9A961]/20 z-40 cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <div className="max-w-md mx-auto flex items-center gap-3 px-4 py-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-9 h-9 rounded-full bg-[#E85D04] text-white flex items-center justify-center flex-shrink-0"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#2D2D2D] truncate">{current.title}</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#E85D04] rounded-full"
                style={{ width: `${(currentTime / current.duration) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatTime(currentTime)}/{formatTime(current.duration)}
          </span>
        </div>
      </div>

      {/* 全屏播放器 */}
      {expanded && (
        <div className="fixed inset-0 bg-[#FAF7F2] z-50 flex flex-col">
          {/* 顶部 */}
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setExpanded(false)} className="text-gray-500">
              <X size={24} />
            </button>
            <span className="text-sm font-medium text-gray-500">音频导读</span>
            <div className="w-6" />
          </div>

          {/* 封面 */}
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-[#E85D04]/20 to-[#C9A961]/20 flex items-center justify-center shadow-lg mb-8">
              <ListMusic size={64} className="text-[#E85D04]/60" />
            </div>
            <h2 className="text-xl font-bold text-[#2D2D2D] text-center mb-1">{current.title}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className={`px-2 py-0.5 rounded-full ${current.type === "HUMAN" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                {current.type === "HUMAN" ? "真人录制" : "AI 克隆"}
              </span>
            </div>
          </div>

          {/* 控制区 */}
          <div className="px-6 pb-8">
            {/* 进度条 */}
            <div className="mb-6">
              <input
                type="range"
                min={0}
                max={current.duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none accent-[#E85D04]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(current.duration)}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button onClick={prevChapter} className="text-gray-400 hover:text-[#2D2D2D]">
                <SkipBack size={28} />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-[#E85D04] text-white flex items-center justify-center shadow-lg"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button onClick={nextChapter} className="text-gray-400 hover:text-[#2D2D2D]">
                <SkipForward size={28} />
              </button>
            </div>

            {/* 底部工具 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowList(!showList)}
                className="flex items-center gap-1.5 text-sm text-gray-500"
              >
                <ListMusic size={18} />
                章节
              </button>
              <button
                onClick={() => {
                  const idx = (speeds.indexOf(speed) + 1) % speeds.length;
                  setSpeed(speeds[idx]);
                }}
                className="flex items-center gap-1.5 text-sm text-gray-500"
              >
                <Gauge size={18} />
                {speed}x
              </button>
              <Volume2 size={18} className="text-gray-500" />
            </div>
          </div>

          {/* 章节列表 */}
          {showList && (
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-80 overflow-auto">
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-500 mb-3">章节列表</h3>
                {chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      goToChapter(i);
                      setShowList(false);
                    }}
                    className={`w-full flex items-center justify-between py-3 px-2 rounded-lg text-left ${
                      i === currentIndex ? "bg-[#E85D04]/10" : ""
                    }`}
                  >
                    <span className={`text-sm ${i === currentIndex ? "text-[#E85D04] font-medium" : "text-[#2D2D2D]"}`}>
                      {ch.title}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(ch.duration)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 隐藏音频元素 */}
      <audio
        ref={audioRef}
        src=""
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextChapter}
      />
    </>
  );
}
