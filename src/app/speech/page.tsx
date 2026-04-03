"use client";

import React, { useState, useRef, useEffect } from "react";

interface TaskStatus {
  task_id: string;
  status: "Pending" | "Processing" | "Success" | "Fail";
  audio_url?: string;
  file_id?: string;
  error?: string;
}

const SYSTEM_VOICES: Record<string, { id: string; name: string }[]> = {
  中文: [
    { id: "Chinese (Mandarin)_Reliable_Executive", name: "可靠高管" },
    { id: "Chinese (Mandarin)_News_Anchor", name: "新聞主播" },
    { id: "Chinese (Mandarin)_Unrestrained_Young_Man", name: "灑脫青年" },
    { id: "Chinese (Mandarin)_Mature_Woman", name: "成熟女性" },
    { id: "Chinese (Mandarin)_Gentleman", name: "紳士" },
    { id: "Chinese (Mandarin)_Warm_Bestie", name: "暖心閨蜜" },
    { id: "Chinese (Mandarin)_Sweet_Lady", name: "甜美女士" },
    { id: "Chinese (Mandarin)_Warm_Girl", name: "溫暖女孩" },
    { id: "Chinese (Mandarin)_Radio_Host", name: "電台主持" },
    { id: "Chinese (Mandarin)_Lyrical_Voice", name: "抒情嗓音" },
    { id: "Chinese (Mandarin)_Soft_Girl", name: "溫柔女孩" },
    { id: "Arrogant_Miss", name: "傲嬌小姐" },
    { id: "Robot_Armor", name: "機器人鎧甲" },
  ],
  英文: [
    { id: "English_expressive_narrator", name: "Expressive Narrator" },
    { id: "English_radiant_girl", name: "Radiant Girl" },
    { id: "English_magnetic_voiced_man", name: "Magnetic-voiced Male" },
    { id: "English_captivating_female1", name: "Captivating Female" },
    { id: "English_Upbeat_Woman", name: "Upbeat Woman" },
    { id: "English_Trustworth_Man", name: "Trustworthy Man" },
    { id: "English_CalmWoman", name: "Calm Woman" },
    { id: "English_Whispering_girl", name: "Whispering Girl" },
    { id: "English_PlayfulGirl", name: "Playful Girl" },
    { id: "English_AnimeCharacter", name: "Anime Character" },
    { id: "English_Jovialman", name: "Jovial Man" },
    { id: "English_Kind-heartedGirl", name: "Kind-hearted Girl" },
  ],
};

export default function SpeechPage() {
  const [ttsText, setTtsText] = useState("");
  const [ttsVoiceId, setTtsVoiceId] = useState("Chinese (Mandarin)_Reliable_Executive");
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const [ttsVolume, setTtsVolume] = useState(1);
  const [ttsEmotion, setTtsEmotion] = useState("neutral");
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"中文" | "英文">("中文");
  const [promptPrefix, setPromptPrefix] = useState<string>(""); // 儲存從 Prompt 庫傳來的 prompt 前綴
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  // 讀取從 Prompt 庫選擇的 prompt
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedPrompt");
    if (stored) {
      try {
        const promptData = JSON.parse(stored);
        if (promptData.category === "tts" && promptData.prompt) {
          // 保存 prompt 前綴
          setPromptPrefix(promptData.prompt);
          // 設置語言和預設語音（根據 prompt 內容判斷）
          if (promptData.prompt.includes("英文")) {
            setSelectedLanguage("英文");
            setTtsVoiceId("English_expressive_narrator");
          } else {
            setSelectedLanguage("中文");
            setTtsVoiceId("Chinese (Mandarin)_Reliable_Executive");
          }
        }
      } catch {
        // ignore
      }
      // 清除存儲
      sessionStorage.removeItem("selectedPrompt");
    }
  }, []);

  // Flatten voices for dropdown
  const allVoices = [
    ...(SYSTEM_VOICES[selectedLanguage] || []).map((v) => ({ ...v, group: selectedLanguage })),
  ];

  // Generate TTS
  const handleGenerateTTS = async () => {
    if (!ttsText.trim()) {
      setTtsError("請輸入要合成的文本");
      return;
    }
    if (!ttsVoiceId) {
      setTtsError("請選擇一個聲音");
      return;
    }

    setIsGenerating(true);
    setTtsError(null);
    setTaskStatus(null);

    try {
      const response = await fetch("/api/minimax/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: "t2a",
          model: "speech-2.8-hd",
          text: ttsText,
          voice_id: ttsVoiceId,
          speed: ttsSpeed,
          volume: ttsVolume,
          pitch: 0,
          emotion: ttsEmotion,
        }),
      });

      const data = await response.json();
      console.log("[TTS] API Response:", data);

      // Handle synchronous TTS response with hex audio
      if (data.data?.audio || data.extra_info?.audio) {
        const audioHex = data.data?.audio || data.extra_info?.audio;
        const audioBytes = new Uint8Array(audioHex.length / 2);
        for (let i = 0; i < audioHex.length; i += 2) {
          audioBytes[i / 2] = parseInt(audioHex.substr(i, 2), 16);
        }
        const audioBlob = new Blob([audioBytes], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setGeneratedAudio(audioUrl);
        setTaskStatus({
          task_id: "sync",
          status: "Success",
          audio_url: audioUrl,
        });
        setTtsError(null);
      } else if (data.task_id) {
        setTaskStatus({
          task_id: data.task_id,
          status: "Pending",
        });
        pollTaskStatus(data.task_id);
      } else {
        const errorMsg = data.error || data.message || data.status_msg || "語音合成請求失敗";
        setTtsError(`${errorMsg}`);
      }
    } catch (error) {
      console.error("[TTS] Error:", error);
      setTtsError(`語音合成失敗: ${error instanceof Error ? error.message : "未知錯誤"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Poll task status
  const pollTaskStatus = (taskId: string) => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;

    const poll = async () => {
      if (!isPollingRef.current) return;

      try {
        const response = await fetch(
          `/api/minimax/speech?action=query_tts&task_id=${taskId}`
        );
        const data = await response.json();

        if (data.status) {
          setTaskStatus({
            task_id: taskId,
            status: data.status,
            audio_url: data.audio_url,
            file_id: data.file_id,
            error: data.error,
          });

          if (data.status === "Pending" || data.status === "Processing") {
            pollingRef.current = setTimeout(poll, 3000);
          } else {
            isPollingRef.current = false;
          }
        }
      } catch (error) {
        console.error("[TTS] Poll error:", error);
        isPollingRef.current = false;
      }
    };

    poll();
  };

  // Download audio
  const downloadAudio = () => {
    if (!generatedAudio && !taskStatus?.audio_url) return;
    const url = generatedAudio || taskStatus?.audio_url;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `tts_${Date.now()}.mp3`;
    a.click();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          語音合成
        </h1>
        <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
          MiniMax TTS 文字轉語音
        </p>
      </div>

      {/* Main TTS Card - Compact */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
        {/* Language Toggle */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">語言：</span>
          <div className="flex rounded-lg border border-neutral-300 dark:border-neutral-600">
            {(["中文", "英文"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setTtsVoiceId(SYSTEM_VOICES[lang][0].id);
                }}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  selectedLanguage === lang
                    ? "bg-[#2563EB] text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-300"
                } ${lang === "中文" ? "rounded-l-lg" : "rounded-r-lg"}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input & Voice Select Row */}
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          {/* Text Input */}
          <div>
            <textarea
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder={promptPrefix ? `${promptPrefix}...` : "輸入要合成的文字..."}
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100"
            />
            {promptPrefix && (
              <p className="mt-1 text-xs text-[#2563EB]">
                ✨ 已套用 Prompt：{promptPrefix}
              </p>
            )}
          </div>

          {/* Voice & Controls */}
          <div className="flex flex-col gap-2">
            <select
              value={ttsVoiceId}
              onChange={(e) => setTtsVoiceId(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700"
            >
              {allVoices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>

            {/* Speed & Volume & Emotion */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-neutral-500">語速</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={ttsSpeed}
                  onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-neutral-400">{ttsSpeed.toFixed(1)}x</span>
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-500">音量</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={ttsVolume}
                  onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-neutral-400">{ttsVolume.toFixed(1)}x</span>
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-500">口氣</label>
                <select
                  value={ttsEmotion}
                  onChange={(e) => setTtsEmotion(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-xs focus:border-[#2563EB] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700"
                >
                  <option value="neutral">中性</option>
                  <option value="happy">開心</option>
                  <option value="sad">悲傷</option>
                  <option value="angry">憤怒</option>
                  <option value="fearful">恐懼</option>
                  <option value="disgusted">厭惡</option>
                  <option value="surprised">驚訝</option>
                  <option value="expressive">生動</option>
                  <option value="whisper">低語</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateTTS}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                生成中...
              </>
            ) : (
              <>
                <span>🔊</span>
                生成音頻
              </>
            )}
          </button>

          {/* Download Button */}
          {(generatedAudio || taskStatus?.audio_url) && (
            <button
              onClick={downloadAudio}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <span>⬇️</span>
              下載
            </button>
          )}
        </div>

        {/* Error */}
        {ttsError && (
          <div className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {ttsError}
          </div>
        )}

        {/* Audio Player */}
        {taskStatus?.audio_url && (
          <div className="mt-3">
            <audio
              controls
              className="w-full"
              src={taskStatus.audio_url}
            >
              您的瀏覽器不支援音頻元素。
            </audio>
          </div>
        )}

        {/* Task Status */}
        {taskStatus && taskStatus.status !== "Success" && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                taskStatus.status === "Pending" || taskStatus.status === "Processing"
                  ? "bg-yellow-500 animate-pulse"
                  : taskStatus.status === "Fail"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            ></span>
            <span className="text-neutral-600 dark:text-neutral-400">
              {taskStatus.status === "Pending" && "等待處理中..."}
              {taskStatus.status === "Processing" && "處理中..."}
              {taskStatus.status === "Fail" && `失敗: ${taskStatus.error || "未知錯誤"}`}
            </span>
          </div>
        )}
      </div>

      {/* Quick Reference - Compact */}
      <div className="mt-4 rounded-xl border border-neutral-200 bg-gradient-to-r from-[#2563EB]/5 to-[#10B981]/5 p-3 dark:border-neutral-700">
        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-2">✨ 快速開始</p>
        <div className="flex flex-wrap gap-2">
          {[
            { text: "你好，歡迎使用語音合成", lang: "中文" },
            { text: "Hello, welcome to voice synthesis", lang: "英文" },
            { text: "今天天氣怎麼樣？", lang: "中文" },
            { text: "What is the weather like today?", lang: "英文" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setTtsText(item.text);
                if (item.lang === "中文") {
                  setSelectedLanguage("中文");
                  setTtsVoiceId(SYSTEM_VOICES.中文[0].id);
                } else {
                  setSelectedLanguage("英文");
                  setTtsVoiceId(SYSTEM_VOICES.英文[0].id);
                }
              }}
              className="rounded-full border border-[#2563EB]/30 bg-white px-3 py-1 text-xs text-[#2563EB] hover:bg-[#2563EB]/10 dark:bg-neutral-800"
            >
              {item.text.length > 15 ? item.text.substring(0, 15) + "..." : item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
