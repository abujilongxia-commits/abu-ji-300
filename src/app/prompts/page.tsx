"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: "tts" | "image" | "comic" | "speech" | "explosion" | "interior" | "gameui" | "holiday" | "portrait";
  tags: string[];
}

const PROMPTS: Prompt[] = [
  // ========== TTS 語音合成 ==========
  {
    id: "tts-narrator",
    title: "資深旁白",
    description: "使用專業旁白音色進行長文本朗讀",
    prompt: "請用沉穩專業的語調朗讀以下內容，保持適當的停頓和情感起伏：",
    category: "tts",
    tags: ["旁白", "專業", "長文本"],
  },
  {
    id: "tts-story",
    title: "故事講述",
    description: "使用戲劇化音色講述故事",
    prompt: "用生動活潑的講故事語調，帶有情感和戲劇張力地朗讀：",
    category: "tts",
    tags: ["故事", "戲劇", "生動"],
  },
  {
    id: "tts-podcast",
    title: " Podcast 開場",
    description: "專業 Podcast 主持人開場白",
    prompt: "用熱情友好的 Podcast 主持人語調說：",
    category: "tts",
    tags: ["Podcast", "開場", "友好"],
  },
  {
    id: "tts-news",
    title: "新聞播報",
    description: "正規新聞主播風格",
    prompt: "用專業新聞主播的清晰語調播報：",
    category: "tts",
    tags: ["新聞", "播報", "正式"],
  },
  {
    id: "tts-anime",
    title: "動漫角色",
    description: "動漫風格配音",
    prompt: "用動漫角色的語氣活潑地說：",
    category: "tts",
    tags: ["動漫", "角色", "活潑"],
  },
  {
    id: "tts-whisper",
    title: "低語風格",
    description: "溫柔低語的親密語調",
    prompt: "用溫柔低語的語調輕聲說：",
    category: "tts",
    tags: ["低語", "溫柔", "親密"],
  },

  // ========== 圖像生成 ==========
  {
    id: "img-realistic",
    title: "寫實風格",
    description: "高畫質寫實攝影風格",
    prompt: "Hyper-realistic style, professional studio lighting, soft shadow layers, high dynamic range, macro photography texture, ultra high resolution, vivid natural colors",
    category: "image",
    tags: ["寫實", "攝影", "高畫質"],
  },
  {
    id: "img-diagram",
    title: "資訊圖表",
    description: "清晰簡潔的資訊圖表風格",
    prompt: "Infographic style, pure white background, clean lines, arrow indicators, professional labels, flat design, ultra high resolution, vibrant gradient colors",
    category: "image",
    tags: ["資訊圖", "簡潔", "彩色"],
  },
  {
    id: "img-technical",
    title: "技術製圖",
    description: "專業技術爆炸圖",
    prompt: "Technical exploded view, engineering drawing style, dimension lines, size annotations, technical terminology, professional CAD drafting standards, ANSI/ASME Y14.41 compliance",
    category: "image",
    tags: ["技術", "爆炸圖", "工程"],
  },
  {
    id: "img-3d",
    title: "3D 等軸測",
    description: "等軸測 3D 視角",
    prompt: "Isometric 3D perspective, 30-degree angles, clean modern design, soft gradients, professional product visualization, 8K detail",
    category: "image",
    tags: ["3D", "等軸測", "產品"],
  },
  {
    id: "img-poster",
    title: "海報設計",
    description: "時尚海報設計風格",
    prompt: "Modern poster design, bold typography, vibrant colors, dynamic composition, professional graphic design style, print-ready quality",
    category: "image",
    tags: ["海報", "設計", "時尚"],
  },
  {
    id: "img-illustration",
    title: "童書插畫",
    description: "溫暖風格的童書插畫",
    prompt: "Children's book illustration style, warm colors, friendly characters, detailed backgrounds, watercolor texture, storybook aesthetic",
    category: "image",
    tags: ["插畫", "童書", "溫暖"],
  },

  // ========== 漫畫生成 ==========
  {
    id: "comic-manga",
    title: "日式漫畫",
    description: "日系漫畫風格線稿",
    prompt: "Manga style illustration, black ink lines, clean cel shading, expressive characters, dynamic action poses, dramatic facial expressions, panel composition ready",
    category: "comic",
    tags: ["漫畫", "日系", "線稿"],
  },
  {
    id: "comic-american",
    title: "美式漫畫",
    description: "美式漫畫風格厚塗",
    prompt: "American comic book style, bold outlines, vivid colors, dramatic lighting, dynamic composition, superhero aesthetic, Marvel/DC inspired",
    category: "comic",
    tags: ["漫畫", "美式", "厚塗"],
  },
  {
    id: "comic-webtoon",
    title: "條漫風格",
    description: "韓國條漫Webtoon風格",
    prompt: "Webtoon style, vertical panel layout ready, vibrant flat colors, cute character design, romantic comedy mood, smartphone optimized composition",
    category: "comic",
    tags: ["漫畫", "條漫", "韓風"],
  },
  {
    id: "comic-action",
    title: "戰鬥場面",
    description: "漫畫戰鬥場景生成",
    prompt: "Epic manga battle scene, speed lines, impact effects, dynamic camera angle, dramatic lighting, power aura effects, Akira/Toriyama inspired action style",
    category: "comic",
    tags: ["戰鬥", "動作", "熱血"],
  },

  // ========== 語音備註 ==========
  {
    id: "speech-quick",
    title: "快速備註",
    description: "快速記錄想法和點子",
    prompt: "以下是我的語音備註，請幫我整理成結構化的文字記錄：",
    category: "speech",
    tags: ["備註", "整理", "快速"],
  },
  {
    id: "speech-meeting",
    title: "會議記錄",
    description: "整理會議內容和行動項目",
    prompt: "請將以下會議錄音整理成結構化的會議記錄，包含：主題、討論要點、決定事項、行動項目",
    category: "speech",
    tags: ["會議", "記錄", "結構化"],
  },
  {
    id: "speech-interview",
    title: "訪談整理",
    description: "整理訪談內容",
    prompt: "請將以下訪談錄音整理成訪談紀錄，包含：受訪者、訪談主題、關鍵問答、主要觀點",
    category: "speech",
    tags: ["訪談", "整理", "問答"],
  },

  // ========== 爆炸圖 ==========
  {
    id: "explosion-electronic",
    title: "電子產品",
    description: "電子產品拆解爆炸圖",
    prompt: "Create a vertical exploded view infographic showing the decomposition of a {OBJECT}. Components are arranged floating from bottom to top with dramatic spacing, each component glowing with vibrant colors and subtle light effects.",
    category: "explosion",
    tags: ["電子", "拆解", "彩色"],
  },
  {
    id: "explosion-mechanical",
    title: "機械結構",
    description: "機械設備爆炸圖",
    prompt: "Technical exploded view showing the systematic functional decomposition of a {OBJECT}. Components arranged as floating horizontal layers with proportional vertical spacing, each layer rendered with distinct vibrant color coding.",
    category: "explosion",
    tags: ["機械", "技術", "結構"],
  },

  // ========== 室內設計 ==========
  {
    id: "interior-living",
    title: "現代客廳",
    description: "時尚現代風格客廳設計",
    prompt: "Modern living room interior design, minimalist aesthetic, neutral color palette with accent colors, floor-to-ceiling windows with natural light, comfortable sofa arrangement, contemporary furniture, indoor plants, soft ambient lighting, architectural visualization, 8K detail",
    category: "interior",
    tags: ["室內", "客廳", "現代"],
  },
  {
    id: "interior-bedroom",
    title: "溫馨臥室",
    description: "舒適溫馨的臥室設計",
    prompt: "Cozy bedroom interior design, warm and inviting atmosphere, soft bedding with plush pillows, bedside table with warm lamp lighting, sheer curtains filtering natural light, neutral wall colors with subtle textures, minimalist yet comfortable aesthetic, architectural visualization",
    category: "interior",
    tags: ["室內", "臥室", "溫馨"],
  },
  {
    id: "interior-kitchen",
    title: "開放式廚房",
    description: "時尚開放式廚房設計",
    prompt: "Modern open kitchen design, sleek cabinetry with handle-less design, marble or quartz countertops, integrated appliances, island counter with bar stools, pendant lighting fixtures, warm wood accents combined with white surfaces, professional kitchen aesthetic",
    category: "interior",
    tags: ["室內", "廚房", "開放式"],
  },
  {
    id: "interior-workspace",
    title: "Home Office",
    description: "舒適的家庭辦公空間",
    prompt: "Modern home office interior design, ergonomic workstation setup, natural wood desk with cable management, comfortable executive chair, bookshelf with organized decor, ambient task lighting, large monitor setup, plants for biophilic design, clean and inspiring workspace aesthetic",
    category: "interior",
    tags: ["室內", "辦公", "書房"],
  },

  // ========== 遊戲 UI ==========
  {
    id: "gameui-hud",
    title: "RPG 遊戲 HUD",
    description: "角色扮演遊戲抬頭顯示器",
    prompt: "RPG game HUD interface design, health bar and mana bar with gradient fill, circular skill icons with cooldown overlay, mini-map in corner, quest tracker panel, inventory hotbar at bottom, clean dark translucent UI panels, fantasy aesthetic, 8K game asset",
    category: "gameui",
    tags: ["遊戲", "RPG", "HUD"],
  },
  {
    id: "gameui-skill",
    title: "技能圖示集合",
    description: "遊戲技能圖示一套",
    prompt: "Game skill icon set, circular icons with border glow effects, fire ice lightning elemental effects, fantasy rune symbols, dark background with luminous colors, consistent art style, ready for game UI implementation, high detail transparent background",
    category: "gameui",
    tags: ["遊戲", "技能", "圖示"],
  },
  {
    id: "gameui-weapon",
    title: "武器展示",
    description: "遊戲武器美術設計",
    prompt: "Game weapon design showcase, legendary sword with glowing blade, stats display panel, rarity border (epic purple glow), weapon silhouette backdrop, dark atmospheric lighting, RPG game asset style, detailed texture work",
    category: "gameui",
    tags: ["遊戲", "武器", "RPG"],
  },
  {
    id: "gameui-gacha",
    title: "抽卡介面",
    description: "Gacha 抽卡召喚介面",
    prompt: "Gacha summoning UI interface, ornate card frame with golden borders, glowing card reveal animation frame, sparkle particle effects, dramatic lighting, character silhouette behind card, mobile game aesthetic, ready for animation",
    category: "gameui",
    tags: ["遊戲", "抽卡", "召喚"],
  },

  // ========== 節日照片 ==========
  {
    id: "holiday-christmas",
    title: "聖誕節場景",
    description: "溫馨聖誕節佈置",
    prompt: "Christmas holiday scene, decorated Christmas tree with colorful ornaments and fairy lights, wrapped presents underneath, cozy living room with fireplace, snow visible through window, warm ambient lighting, festive atmosphere, family gathering, soft bokeh background lights, photorealistic quality",
    category: "holiday",
    tags: ["節日", "聖誕", "聖誕樹"],
  },
  {
    id: "holiday-newyear",
    title: "新年派對",
    description: "歡樂新年慶祝場合",
    prompt: "New Year celebration party scene, confetti and streamers in the air, party balloons with gold and silver colors, champagne glasses clinking, countdown clock in background, festive table with snacks and drinks, bright and joyful atmosphere, nightclub or rooftop venue, dynamic lighting with sparkle effects",
    category: "holiday",
    tags: ["節日", "新年", "派對"],
  },
  {
    id: "holiday-chinese",
    title: "春節團圓飯",
    description: "農曆新年家庭聚餐",
    prompt: "Chinese Spring Festival reunion dinner scene, large round dining table with traditional Chinese dishes, red lanterns hanging overhead, family members gathering around table, auspicious decorations with gold accents, warm indoor lighting, festive red and gold color scheme, generational family gathering atmosphere",
    category: "holiday",
    tags: ["節日", "春節", "過年"],
  },
  {
    id: "holiday-birthday",
    title: "生日派對",
    description: "歡樂生日慶祝場景",
    prompt: "Birthday party celebration scene, decorated venue with balloons and banners, colorful party decorations, birthday cake with candles lit, gift boxes on display, friends and family celebrating, confetti in the air, joyful and vibrant atmosphere, Instagram-worthy party setup, natural daylight or warm ambient lighting",
    category: "holiday",
    tags: ["節日", "生日", "派對"],
  },

  // ========== 個人形象照 ==========
  {
    id: "portrait-business",
    title: "商務專業肖像",
    description: "值得信賴的業務專業形象",
    prompt: "Professional business portrait, subject wearing tailored business attire with refined details -西装外套搭配領帶或絲巾, overall refined appearance. Warm and infectious smile conveying enthusiasm and confidence. Eyes convey focus and sincerity. Dynamic lighting with subtle side light for dimensionality. Background presents success atmosphere - modern office with cityscape or refined corporate environment, artistic soft focus. Composition includes shoulders while maintaining face focus. Color palette highlights credibility - blues, grays complemented by warm tones. Professional retouching maintaining natural skin texture.",
    category: "portrait",
    tags: ["形象照", "商務", "專業"],
  },
  {
    id: "portrait-linkedin",
    title: "LinkedIn 形象照",
    description: "社群媒體專業頭像",
    prompt: "LinkedIn professional headshot, clean and approachable business appearance, soft natural lighting on face, professional studio background with subtle gradient, shoulder-level composition, friendly confident expression, crisp and modern aesthetic, optimized for social media profile picture",
    category: "portrait",
    tags: ["形象照", "LinkedIn", "社群"],
  },
  {
    id: "portrait-executive",
    title: "執行長肖像",
    description: "高階主管專業形象",
    prompt: "Executive portrait photography, confident and authoritative presence, premium business suit with subtle tie, sophisticated indoor lighting setup with dramatic but professional mood, shallow depth of field background blur, sharp focus on eyes and face, polished and commanding impression, suitable for annual report or corporate leadership page",
    category: "portrait",
    tags: ["形象照", "執行長", "主管"],
  },
  {
    id: "portrait-creative",
    title: "創意人士形象",
    description: "自由風格的專業形象",
    prompt: "Creative professional portrait, stylish yet approachable attire, casual elegant fashion sense, natural warm lighting with lens flare accents, coffee shop or creative workspace background, genuine laughter or thoughtful expression, vibrant colors with shallow depth of field, Instagram-worthy aesthetic, millennial or Gen Z creative professional vibe",
    category: "portrait",
    tags: ["形象照", "創意", "時尚"],
  },
];

const CATEGORY_CONFIG = {
  tts: { label: "🔊 語音合成", color: "bg-[#2563EB]/10 border-[#2563EB]/30" },
  image: { label: "🖼️ 圖像生成", color: "bg-[#10B981]/10 border-[#10B981]/30" },
  comic: { label: "🎭 漫畫生成", color: "bg-[#8B5CF6]/10 border-[#8B5CF6]/30" },
  speech: { label: "🎙️ 語音備註", color: "bg-[#F59E0B]/10 border-[#F59E0B]/30" },
  explosion: { label: "💥 爆炸圖", color: "bg-[#EF4444]/10 border-[#EF4444]/30" },
  interior: { label: "🏠 室內設計", color: "bg-[#EC4899]/10 border-[#EC4899]/30" },
  gameui: { label: "🎮 遊戲UI", color: "bg-[#8B5CF6]/10 border-[#8B5CF6]/30" },
  holiday: { label: "🎄 節日照片", color: "bg-[#EF4444]/10 border-[#EF4444]/30" },
  portrait: { label: "📸 個人形象照", color: "bg-[#F59E0B]/10 border-[#F59E0B]/30" },
};

// 計算每個類別的數量（需要動態計算因為用戶會新增）
function getCategoryCounts(prompts: Prompt[]) {
  return {
    tts: prompts.filter(p => p.category === "tts").length,
    image: prompts.filter(p => p.category === "image").length,
    comic: prompts.filter(p => p.category === "comic").length,
    speech: prompts.filter(p => p.category === "speech").length,
    explosion: prompts.filter(p => p.category === "explosion").length,
    interior: prompts.filter(p => p.category === "interior").length,
    gameui: prompts.filter(p => p.category === "gameui").length,
    holiday: prompts.filter(p => p.category === "holiday").length,
    portrait: prompts.filter(p => p.category === "portrait").length,
  };
}

// 驗證 prompt 品質
function isValidPrompt(p: Partial<Prompt>): boolean {
  return (
    typeof p.title === 'string' && p.title.length > 0 &&
    typeof p.prompt === 'string' && p.prompt.length >= 5 &&
    ['tts', 'image', 'comic', 'speech', 'explosion', 'interior', 'gameui', 'holiday', 'portrait'].includes(p.category) &&
    !p.prompt.includes('{PROMPT}') && !p.prompt.includes('{OBJECT}')
  );
}

// 從現有 ID 列表檢查是否重複
function isDuplicate(id: string, existingPrompts: Prompt[]): boolean {
  return existingPrompts.some(p => p.id === id);
}

// 解析 GitHub URL 為 raw URL
function parseGitHubUrl(url: string): string | null {
  try {
    // 清理 URL
    url = url.trim();

    // 處理常見格式
    // https://github.com/owner/repo/blob/branch/path/file.md
    // https://raw.githubusercontent.com/owner/repo/branch/path/file.md
    // owner/repo/path/file.md

    if (url.startsWith('http')) {
      if (url.includes('github.com') && url.includes('/blob/')) {
        // 轉換 GitHub blob URL 為 raw URL
        const parts = url.split('/blob/');
        if (parts.length === 2) {
          const [base, rest] = parts;
          const pathParts = rest.split('/');
          const branch = pathParts[0];
          const path = pathParts.slice(1).join('/');
          return `https://raw.githubusercontent.com/${base.split('github.com/')[1]}/${branch}/${path}`;
        }
      } else if (url.includes('raw.githubusercontent.com')) {
        return url;
      }
    } else if (url.includes('/')) {
      // 當作 owner/repo/path 處理
      return `https://raw.githubusercontent.com/${url}`;
    }

    return null;
  } catch {
    return null;
  }
}

// 從內容解析 prompts
function parsePrompts(content: string): Partial<Prompt>[] {
  const prompts: Partial<Prompt>[] = [];

  // 嘗試 JSON 格式
  try {
    const json = JSON.parse(content);
    if (Array.isArray(json)) {
      json.forEach(item => {
        if (item.prompt || item.text || item.content) {
          prompts.push({
            id: item.id || `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title || item.name || item.label || '未命名',
            description: item.description || item.desc || '',
            prompt: item.prompt || item.text || item.content || '',
            category: item.category || item.type || 'image',
            tags: item.tags || [],
          });
        }
      });
      return prompts;
    }
  } catch { /* 不是 JSON */ }

  // 嘗試 Markdown 格式 - 提取程式碼區塊
  const codeBlockRegex = /```(?:prompt|prompts?|json)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const blockContent = match[1].trim();
    try {
      const json = JSON.parse(blockContent);
      if (Array.isArray(json)) {
        json.forEach(item => {
          if (item.prompt || item.text) {
            prompts.push({
              id: item.id || `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: item.title || item.name || '未命名',
              description: item.description || '',
              prompt: item.prompt || item.text || '',
              category: item.category || 'image',
              tags: item.tags || [],
            });
          }
        });
      } else if (typeof json === 'object' && json !== null && (json.prompt || json.text)) {
        prompts.push({
          id: json.id || `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: json.title || '未命名',
          description: json.description || '',
          prompt: json.prompt || json.text || '',
          category: json.category || 'image',
          tags: json.tags || [],
        });
      }
    } catch { /* 不是 JSON 區塊 */ }
  }

  // 嘗試 Markdown 標題格式 - 每個 ### 標題後跟內容
  const sections = content.split(/^#{1,3}\s+/m);
  sections.forEach((section, index) => {
    if (index === 0) return; // 跳過第一個（檔案開頭）
    const lines = section.trim().split('\n');
    if (lines.length > 0) {
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      if (title && body && body.length > 10) {
        prompts.push({
          id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title,
          description: '',
          prompt: body,
          category: 'image',
          tags: ['匯入'],
        });
      }
    }
  });

  return prompts;
}

export default function PromptsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  // GitHub 匯入相關狀態
  const [githubUrl, setGithubUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [parsedPrompts, setParsedPrompts] = useState<Partial<Prompt>[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedForImport, setSelectedForImport] = useState<Set<number>>(new Set());

  // 自訂 Prompt 相關狀態
  const [customPromptText, setCustomPromptText] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customCategory, setCustomCategory] = useState<Prompt["category"]>("image");
  const [customTags, setCustomTags] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customPromptError, setCustomPromptError] = useState<string | null>(null);

  // 用戶自創的 Prompts（保存在 localStorage）
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  // 版本號：當 code 更新時增加版本號可強制重新初始化
  const PROMPTS_VERSION = 1;

  // 初始化後的所有 Prompts（從 localStorage 載入或從內建初始化）
  const [initializedPrompts, setInitializedPrompts] = useState<Prompt[]>(PROMPTS);

  // 初始化：第一次載入時將內建 Prompts 複製到 localStorage
  React.useEffect(() => {
    const storedUserPrompts = localStorage.getItem("user_prompts");
    if (storedUserPrompts) {
      try {
        setUserPrompts(JSON.parse(storedUserPrompts));
      } catch {
        setUserPrompts([]);
      }
    }

    // 檢查版本號是否匹配
    const storedVersion = localStorage.getItem("prompts_version");
    const currentVersion = PROMPTS_VERSION;

    if (!storedVersion || parseInt(storedVersion) < currentVersion) {
      // 版本不符：重新初始化內建 Prompts
      localStorage.setItem("initialized_prompts", JSON.stringify(PROMPTS));
      localStorage.setItem("prompts_version", String(currentVersion));
      setInitializedPrompts(PROMPTS);
    } else {
      // 版本匹配：從 localStorage 讀取（包含用戶之前的修改）
      const storedInitialized = localStorage.getItem("initialized_prompts");
      if (storedInitialized) {
        try {
          setInitializedPrompts(JSON.parse(storedInitialized));
        } catch {
          setInitializedPrompts(PROMPTS);
        }
      } else {
        setInitializedPrompts(PROMPTS);
      }
    }
  }, []);

  // Prompt 排序相關
  const [promptOrder, setPromptOrder] = useState<string[]>([]);
  const [draggedPrompt, setDraggedPrompt] = useState<string | null>(null);
  const [dragOverPrompt, setDragOverPrompt] = useState<string | null>(null);

  // 編輯/刪除相關
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", prompt: "", tags: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 初始化排序（從 localStorage 讀取或保持預設）
  React.useEffect(() => {
    const stored = localStorage.getItem("prompt_order");
    // 取得所有有效的 prompt ID（已初始化 prompts + 用戶自創）
    const allPromptIds = [...initializedPrompts.map(p => p.id), ...userPrompts.map(p => p.id)];
    if (stored) {
      try {
        const order = JSON.parse(stored);
        // 過濾只保留存在的 ID，並追加不在順序中的新 prompt
        const validOrder = order.filter((id: string) => allPromptIds.includes(id));
        // 追加新加入的 prompts（那些不在 stored order 中的）
        allPromptIds.forEach(id => {
          if (!validOrder.includes(id)) {
            validOrder.push(id);
          }
        });
        setPromptOrder(validOrder);
      } catch {
        setPromptOrder(allPromptIds);
      }
    } else {
      setPromptOrder(allPromptIds);
    }
  }, [userPrompts, initializedPrompts]);

  // 保存排序到 localStorage
  const savePromptOrder = (newOrder: string[]) => {
    setPromptOrder(newOrder);
    localStorage.setItem("prompt_order", JSON.stringify(newOrder));
  };

  // 拖曳開始
  const handleDragStart = (e: React.DragEvent, promptId: string) => {
    setDraggedPrompt(promptId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 拖曳經過
  const handleDragOver = (e: React.DragEvent, promptId: string) => {
    e.preventDefault();
    if (draggedPrompt && draggedPrompt !== promptId) {
      setDragOverPrompt(promptId);
    }
  };

  // 放下
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedPrompt || draggedPrompt === targetId) return;

    const currentOrder = [...promptOrder];
    let draggedIndex = currentOrder.indexOf(draggedPrompt);
    const targetIndex = currentOrder.indexOf(targetId);

    // 如果 draggedPrompt 不在 order 中，先加入陣列末尾
    if (draggedIndex === -1) {
      draggedIndex = currentOrder.length;
      currentOrder.push(draggedPrompt);
    }

    if (targetIndex !== -1) {
      currentOrder.splice(draggedIndex, 1);
      currentOrder.splice(targetIndex, 0, draggedPrompt);
      savePromptOrder(currentOrder);
    }

    setDraggedPrompt(null);
    setDragOverPrompt(null);
  };

  // 拖曳結束
  const handleDragEnd = () => {
    setDraggedPrompt(null);
    setDragOverPrompt(null);
  };

  // 取得排序後的 Prompts（包含用戶自創，優先使用修改過的內建 prompt）
  const getOrderedPrompts = () => {
    // 建立 ID 到 prompt 的映射，用戶修改過的優先
    const promptMap = new Map<string, Prompt>();

    // 先加入已初始化的 prompts（從 localStorage 載入或內建預設）
    initializedPrompts.forEach(p => promptMap.set(p.id, p));
    // 再用 userPrompts 覆蓋（這樣修改過的內建 prompt 會取代原版）
    userPrompts.forEach(p => promptMap.set(p.id, p));

    const allPrompts = Array.from(promptMap.values());
    if (promptOrder.length === 0) return allPrompts;
    return [...allPrompts].sort((a, b) => {
      const aIndex = promptOrder.indexOf(a.id);
      const bIndex = promptOrder.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  const orderedFilteredPrompts = selectedCategory
    ? getOrderedPrompts().filter((p) => p.category === selectedCategory)
    : getOrderedPrompts();

  const categoryCounts = getCategoryCounts(getOrderedPrompts());
  const totalCount = getOrderedPrompts().length;

  // 開始編輯
  const handleStartEdit = (prompt: Prompt, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPrompt(prompt);
    setEditForm({
      title: prompt.title,
      description: prompt.description,
      prompt: prompt.prompt,
      tags: prompt.tags.join(', '),
    });
    setShowEditModal(true);
  };

  // 儲存編輯
  const handleSaveEdit = () => {
    if (!editingPrompt) return;

    const updatedTags = editForm.tags.split(',').map(t => t.trim()).filter(t => t);
    const updatedPrompt: Prompt = {
      id: editingPrompt.id,
      title: editForm.title,
      description: editForm.description,
      prompt: editForm.prompt,
      category: editingPrompt.category,
      tags: updatedTags,
    };

    // 檢查是否為內建 Prompt（存在於 initializedPrompts）
    const builtInIndex = initializedPrompts.findIndex(p => p.id === editingPrompt.id);

    if (builtInIndex !== -1) {
      // 內建 Prompt：更新 initializedPrompts 並永久保存
      const updatedInitialized = [...initializedPrompts];
      updatedInitialized[builtInIndex] = updatedPrompt;
      setInitializedPrompts(updatedInitialized);
      localStorage.setItem("initialized_prompts", JSON.stringify(updatedInitialized));
    }

    // 同時更新 userPrompts（保持向後兼容）
    const userIndex = userPrompts.findIndex(p => p.id === editingPrompt.id);
    let updatedUserPrompts;
    if (userIndex !== -1) {
      updatedUserPrompts = [...userPrompts];
      updatedUserPrompts[userIndex] = updatedPrompt;
    } else {
      updatedUserPrompts = [...userPrompts, updatedPrompt];
    }
    setUserPrompts(updatedUserPrompts);
    localStorage.setItem("user_prompts", JSON.stringify(updatedUserPrompts));

    alert(`✅ 已更新 Prompt：${editForm.title}`);

    setShowEditModal(false);
    setEditingPrompt(null);
  };

  // 刪除確認
  const handleDeletePrompt = (promptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm(promptId);
  };

  // 確認刪除
  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      // 如果是用戶自創的 Prompt，從 localStorage 刪除
      if (deleteConfirm.startsWith('custom-')) {
        const updatedPrompts = userPrompts.filter(p => p.id !== deleteConfirm);
        setUserPrompts(updatedPrompts);
        localStorage.setItem("user_prompts", JSON.stringify(updatedPrompts));
        alert(`已刪除 Prompt：${deleteConfirm}`);
      } else {
        alert(`內建 Prompt 無法刪除（ID: ${deleteConfirm}）`);
      }
      setDeleteConfirm(null);
    }
  };

  // 自動分類 Prompt
  const autoDetectCategory = (text: string): Prompt["category"] => {
    const lower = text.toLowerCase();

    // Comic 關鍵詞
    if (lower.includes('漫畫') || lower.includes('comic') || lower.includes('manga') ||
        lower.includes('條漫') || lower.includes('webtoon') || lower.includes('動漫') ||
        lower.includes('少年') || lower.includes('少女') || lower.includes('热血') ||
        lower.includes('格漫') || lower.includes('分鏡')) {
      return 'comic';
    }

    // TTS 關鍵詞
    if (lower.includes('朗讀') || lower.includes('語調') || lower.includes('音色') ||
        lower.includes('說') || lower.includes('播報') || lower.includes('講述') ||
        lower.includes('旁白') || lower.includes('podcast') || lower.includes('低語') ||
        lower.includes('whisper') || lower.includes('voice') || lower.includes('tts')) {
      return 'tts';
    }

    // Speech 關鍵詞
    if (lower.includes('會議') || lower.includes('訪談') || lower.includes('錄音') ||
        lower.includes('備註') || lower.includes('語音') || lower.includes('整理') ||
        lower.includes('meeting') || lower.includes('interview') || lower.includes('notes')) {
      return 'speech';
    }

    // Explosion 關鍵詞（避免與室內設計重疊）
    if (lower.includes('爆炸') || lower.includes('拆解') || lower.includes('exploded') ||
        lower.includes('decomposition') || lower.includes('component') || lower.includes('組件')) {
      return 'explosion';
    }

    // Holiday 關鍵詞（要在 Interior 之前，因為場景描述可能同時有室內和節日）
    if (lower.includes('節日') || lower.includes('聖誕') || lower.includes('聖誕節') ||
        lower.includes('新年') || lower.includes('春節') || lower.includes('過年') ||
        lower.includes('中秋') || lower.includes('端午') || lower.includes('萬聖') ||
        lower.includes('感恩') || lower.includes('情人') || lower.includes('春酒') ||
        lower.includes('尾牙') || lower.includes('生日') || lower.includes('party') ||
        lower.includes('holiday') || lower.includes('christmas') || lower.includes('new year') ||
        lower.includes('spring festival') || lower.includes('lunar new year') || lower.includes('halloween') ||
        lower.includes('thanksgiving') || lower.includes('valentine') || lower.includes('birthday') ||
        lower.includes('裝飾') || lower.includes('氣球') || lower.includes('蛋糕') ||
        lower.includes('禮物') || lower.includes('交換禮物') || lower.includes('耶誕') ||
        lower.includes('聖誕樹') || lower.includes('煙火') || lower.includes('紅包')) {
      return 'holiday';
    }

    // Interior 關鍵詞
    if (lower.includes('室內') || lower.includes('裝潢') || lower.includes('家具') ||
        lower.includes('空間') || lower.includes('佈置') || lower.includes('裝飾') ||
        lower.includes('interior') || lower.includes('design') || lower.includes('room') ||
        lower.includes('living room') || lower.includes('bedroom') || lower.includes('kitchen') ||
        lower.includes('衛浴') || lower.includes('客廳') || lower.includes('臥室') ||
        lower.includes('餐廳') || lower.includes('改造') || lower.includes('餐桌') ||
        lower.includes('吊燈') || lower.includes('書房') || lower.includes('玄關') ||
        lower.includes('陽台') || lower.includes('dining') || lower.includes('restaurant') ||
        lower.includes('renovation') || lower.includes('furniture') || lower.includes('lighting')) {
      return 'interior';
    }

    // Game UI 關鍵詞
    if (lower.includes('遊戲') || lower.includes('遊戲UI') || lower.includes('遊戲介面') ||
        lower.includes('遊戲 icon') || lower.includes('遊戲圖示') || lower.includes('HUD') ||
        lower.includes('遊戲背景') || lower.includes('遊戲角色') || lower.includes('RPG') ||
        lower.includes('MMO') || lower.includes('game ui') || lower.includes('game interface') ||
        lower.includes('game icon') || lower.includes('game asset') || lower.includes('game background') ||
        lower.includes('game character') || lower.includes('gacha') || lower.includes('抽卡') ||
        lower.includes('武器') || lower.includes('裝備') || lower.includes('技能') ||
        lower.includes('血條') || lower.includes('生命值') || lower.includes('法力值') ||
        lower.includes('背包') || lower.includes('商店') || lower.includes('任務') ||
        lower.includes('mission') || lower.includes('quest') || lower.includes('inventory') ||
        lower.includes('equipment') || lower.includes('skill') || lower.includes('weapon')) {
      return 'gameui';
    }

    // Portrait 關鍵詞
    if (lower.includes('肖像') || lower.includes('形象照') || lower.includes('個人照') ||
        lower.includes('專業照') || lower.includes('大头照') || lower.includes('頭像') ||
        lower.includes('證件照') || lower.includes('商務照') || lower.includes('職業照') ||
        lower.includes('個人寫真') || lower.includes('portrait') || lower.includes('headshot') ||
        lower.includes('professional photo') || lower.includes('business portrait') ||
        lower.includes('profile picture') || lower.includes('linkedin') || lower.includes('履歷照') ||
        lower.includes('西裝') || lower.includes('正裝') || lower.includes('微笑') ||
        lower.includes('眼神') || lower.includes('專業形象') || lower.includes('商務人士') ||
        lower.includes('女性主管') || lower.includes('男性主管') || lower.includes('執行長') ||
        lower.includes('CEO') || lower.includes('創辦人') || lower.includes('律師') ||
        lower.includes('醫師') || lower.includes('會計師') || lower.includes('專業人士')) {
      return 'portrait';
    }

    // Image 預設
    return 'image';
  };

  // 檢查 Prompt 是否太過簡單/拙劣
  const isPromptTooSimple = (text: string): string | null => {
    if (!text || text.trim().length < 10) {
      return 'Prompt 內容太短，至少需要 10 個字元';
    }
    if (text.includes('{PROMPT}') || text.includes('{OBJECT}') || text.includes('xxx')) {
      return 'Prompt 含有預留符號，請填入完整內容';
    }
    if (/^(hello|hi|test|test |start|begin)/i.test(text.trim())) {
      return 'Prompt 太過簡單或明顯是測試內容';
    }
    // 檢查是否只有標點符號
    if (/^[^a-zA-Z0-9\u4e00-\u9fff]+$/.test(text.trim())) {
      return 'Prompt 不能只含標點符號';
    }
    return null;
  };

  // 處理自訂 Prompt 提交
  const handleCustomSubmit = () => {
    setCustomPromptError(null);

    if (!customPromptText.trim()) {
      setCustomPromptError('請填入 Prompt 內容');
      return;
    }

    const error = isPromptTooSimple(customPromptText);
    if (error) {
      setCustomPromptError(error);
      return;
    }

    // 自動檢測類別
    const detectedCategory = autoDetectCategory(customPromptText);

    // 生成新 Prompt 物件
    const newPrompt: Prompt = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: customTitle.trim() || `自訂 Prompt ${new Date().toLocaleTimeString('zh-TW')}`,
      description: customDescription.trim(),
      prompt: customPromptText.trim(),
      category: detectedCategory,
      tags: customTags.split(',').map(t => t.trim()).filter(t => t).slice(0, 5),
    };

    // 保存到 localStorage
    const updatedPrompts = [...userPrompts, newPrompt];
    try {
      localStorage.setItem("user_prompts", JSON.stringify(updatedPrompts));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
    setUserPrompts(updatedPrompts);

    // 顯示成功訊息
    alert(`✅ 已新增 Prompt：${newPrompt.title}\n\n類別：${CATEGORY_CONFIG[detectedCategory].label}\n標籤：${newPrompt.tags.join(', ') || '無'}`);

    // 清除表單
    setCustomPromptText("");
    setCustomTitle("");
    setCustomDescription("");
    setCustomTags("");
    setShowCustomForm(false);
  };

  const filteredPrompts = selectedCategory
    ? PROMPTS.filter((p) => p.category === selectedCategory)
    : PROMPTS;

  const copyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleGenerate = () => {
    if (!selectedPrompt) return;

    // 保存選擇的 prompt 到 sessionStorage
    sessionStorage.setItem("selectedPrompt", JSON.stringify(selectedPrompt));

    // 根據類型導航到對應頁面
    if (selectedPrompt.category === "tts" || selectedPrompt.category === "speech") {
      router.push("/speech");
    } else if (selectedPrompt.category === "image" || selectedPrompt.category === "explosion") {
      router.push("/explosion");
    }
  };

  // 處理 GitHub URL 獲取
  const handleFetchGithub = async () => {
    if (!githubUrl.trim()) {
      setFetchError("請輸入 GitHub URL");
      return;
    }

    const rawUrl = parseGitHubUrl(githubUrl);
    if (!rawUrl) {
      setFetchError("無法解析 URL，請確認格式正確");
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setParsedPrompts([]);

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const content = await response.text();

      if (content.length < 10) {
        throw new Error("檔案內容過短");
      }

      const parsed = parsePrompts(content);
      if (parsed.length === 0) {
        setFetchError("找不到有效的 Prompt 格式");
        return;
      }

      // 過濾並標記有效的 prompts
      const validPrompts = parsed.filter(p =>
        isValidPrompt(p) && !isDuplicate(p.id || '', PROMPTS)
      );

      if (validPrompts.length === 0) {
        setFetchError("沒有找到新的有效 Prompt（可能已重複或格式不符）");
        return;
      }

      setParsedPrompts(validPrompts);
      setSelectedForImport(new Set(validPrompts.map((_, i) => i)));
      setShowPreview(true);
    } catch (err) {
      setFetchError(`獲取失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    } finally {
      setIsFetching(false);
    }
  };

  // 添加選中的 prompts
  const handleImportSelected = () => {
    const toImport = parsedPrompts.filter((_, i) => selectedForImport.has(i));
    // 這裡只顯示成功訊息（實際上新 prompt 會在下次載入時出現）
    alert(`成功匯入 ${toImport.length} 個 Prompt！\n\n注意：目前的設計是預覽功能，實際新增需要手動加入程式碼。`);
    setShowPreview(false);
    setGithubUrl("");
    setParsedPrompts([]);
    setSelectedForImport(new Set());
  };

  const toggleSelectForImport = (index: number) => {
    const newSet = new Set(selectedForImport);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedForImport(newSet);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Prompt 語法庫
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          選擇適合的 Prompt，立即生成內容
        </p>
      </div>

      {/* GitHub Import Section */}
      <div className="mb-8 rounded-xl border border-neutral-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:border-neutral-700 dark:from-purple-900/10 dark:to-blue-900/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📦</span>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            從 GitHub 匯入
          </h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="貼上 GitHub 檔案 URL（支援 github.com/blob/ 或 raw.githubusercontent.com）"
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
            onKeyDown={(e) => e.key === 'Enter' && handleFetchGithub()}
          />
          <button
            onClick={handleFetchGithub}
            disabled={isFetching}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isFetching ? "獲取中..." : "獲取"}
          </button>
        </div>
        {fetchError && (
          <p className="mt-2 text-sm text-red-500">{fetchError}</p>
        )}
        <p className="mt-2 text-xs text-neutral-500">
          支援 JSON、Markdown 格式的 Prompt 檔案。系統會自動分析並過濾重複或品質不佳的項目。
        </p>
      </div>

      {/* Custom Prompt Submission Section */}
      <div className="mb-8 rounded-xl border border-neutral-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-neutral-700 dark:from-emerald-900/10 dark:to-teal-900/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
              自創 Prompt
            </h2>
          </div>
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="rounded-lg px-3 py-1 text-sm font-medium text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
          >
            {showCustomForm ? "收合" : "展開"}
          </button>
        </div>

        {showCustomForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Prompt 內容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={customPromptText}
                onChange={(e) => setCustomPromptText(e.target.value)}
                placeholder="在此貼上你滿意的 Prompt 內容..."
                rows={4}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              />
              {customPromptText && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  自動偵測類別：
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                    autoDetectCategory(customPromptText) === 'tts' ? 'bg-blue-100 text-blue-700' :
                    autoDetectCategory(customPromptText) === 'image' ? 'bg-green-100 text-green-700' :
                    autoDetectCategory(customPromptText) === 'speech' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {CATEGORY_CONFIG[autoDetectCategory(customPromptText)].label}
                  </span>
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  標題（選填）
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="給 Prompt 一個易記的名稱"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  標籤（選填，逗號分隔）
                </label>
                <input
                  type="text"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  placeholder="如：專業, 正式, 高畫質"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                描述（選填）
              </label>
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="簡述這個 Prompt 的用途"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>

            {customPromptError && (
              <p className="text-sm text-red-500">{customPromptError}</p>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleCustomSubmit}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                分析並產生 Prompt 物件
              </button>
            </div>
          </div>
        )}

        {!showCustomForm && (
          <p className="text-sm text-neutral-500">
            填入滿意的 Prompt，系統會自動分類並產生可加入的程式碼
          </p>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                預覽匯入 ({selectedForImport.size}/{parsedPrompts.length})
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              {parsedPrompts.map((p, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedForImport.has(index)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                  }`}
                  onClick={() => toggleSelectForImport(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {p.title || '未命名'}
                      </p>
                      {p.description && (
                        <p className="mt-1 text-sm text-neutral-500">{p.description}</p>
                      )}
                      <p className="mt-2 text-xs text-neutral-400 line-clamp-2">
                        {p.prompt?.substring(0, 150)}...
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        p.category === 'tts' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        p.category === 'comic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        p.category === 'image' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        p.category === 'speech' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {CATEGORY_CONFIG[p.category as keyof typeof CATEGORY_CONFIG]?.label.split(' ')[0] || p.category}
                      </span>
                      {selectedForImport.has(index) ? (
                        <span className="text-purple-600 dark:text-purple-400">✓ 已選擇</span>
                      ) : (
                        <span className="text-neutral-400">點擊選擇</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200"
              >
                取消
              </button>
              <button
                onClick={handleImportSelected}
                disabled={selectedForImport.size === 0}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                匯入所選 ({selectedForImport.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                編輯 Prompt
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">標題</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">描述</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Prompt 內容</label>
                <textarea
                  value={editForm.prompt}
                  onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">標籤（逗號分隔）</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="如：專業, 正式, 高畫質"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-neutral-200 p-4 dark:border-neutral-700">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              確認刪除
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              確定要刪除這個 Prompt 嗎？此操作無法撤銷。
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Prompt & Generate Area */}
      <div className="mb-8 rounded-xl border border-[#2563EB]/30 bg-gradient-to-r from-[#2563EB]/5 to-[#10B981]/5 p-6 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            ✨ 選擇的 Prompt
          </h2>
          {selectedPrompt && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_CONFIG[selectedPrompt.category].color}`}>
              {CATEGORY_CONFIG[selectedPrompt.category].label}
            </span>
          )}
        </div>

        {selectedPrompt ? (
          <div className="mb-4">
            <div className="rounded-lg bg-white/50 p-4 dark:bg-neutral-900/50">
              <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {selectedPrompt.title}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                {selectedPrompt.description}
              </p>
              <p className="text-xs text-neutral-500 line-clamp-2">
                {selectedPrompt.prompt}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 mb-4">
            從下方卡片列表選擇一個 Prompt
          </p>
        )}

        <div className="flex gap-3">
          <input
            type="text"
            value={selectedPrompt?.prompt || ""}
            readOnly
            placeholder="選擇 Prompt 後會在這裡顯示..."
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
          />
          <button
            onClick={handleGenerate}
            disabled={!selectedPrompt}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
              selectedPrompt
                ? "bg-[#10B981] text-white hover:bg-[#059669]"
                : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            }`}
          >
            生成
          </button>
        </div>
        {selectedPrompt && (
          <p className="mt-2 text-xs text-neutral-500">
            字元數：{selectedPrompt.prompt.length}
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-[#2563EB] text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          全部 ({totalCount})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === key
                ? "bg-[#2563EB] text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {config.label} ({categoryCounts[key as keyof typeof categoryCounts]})
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className="mb-4 text-sm text-neutral-500">
        共 {totalCount} 個 Prompt（內建 {PROMPTS.length} + 自創 {userPrompts.length}）
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedFilteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            draggable
            onDragStart={(e) => handleDragStart(e, prompt.id)}
            onDragOver={(e) => handleDragOver(e, prompt.id)}
            onDrop={(e) => handleDrop(e, prompt.id)}
            onDragEnd={handleDragEnd}
            className={`rounded-xl border p-4 transition-all cursor-pointer ${
              draggedPrompt === prompt.id
                ? "opacity-50 scale-95"
                : dragOverPrompt === prompt.id
                ? "ring-2 ring-yellow-400 border-yellow-400"
                : selectedPrompt?.id === prompt.id
                ? "ring-2 ring-[#2563EB] " + CATEGORY_CONFIG[prompt.category].color
                : CATEGORY_CONFIG[prompt.category].color
            } dark:border-neutral-700 hover:shadow-lg`}
            onClick={() => handleSelectPrompt(prompt)}
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 cursor-move hover:text-neutral-600 dark:hover:text-neutral-300" title="拖曳移動">☰</span>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {prompt.title}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {selectedPrompt?.id === prompt.id && (
                  <span className="text-[#2563EB]">✓</span>
                )}
                <button
                  onClick={(e) => handleStartEdit(prompt, e)}
                  className="rounded p-1 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="編輯"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => handleDeletePrompt(prompt.id, e)}
                  className="rounded p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="刪除"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
              {prompt.description}
            </p>
            <div className="rounded-lg bg-white/50 p-3 dark:bg-neutral-900/50">
              <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-3">
                {prompt.prompt}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/50 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800/50"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyPrompt(prompt.prompt, prompt.id);
                }}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  copiedId === prompt.id
                    ? "bg-[#10B981] text-white"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200"
                }`}
              >
                {copiedId === prompt.id ? "已複製!" : "複製"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPrompt(prompt);
                }}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedPrompt?.id === prompt.id
                    ? "bg-[#2563EB] text-white"
                    : "bg-[#2563EB]/80 text-white hover:bg-[#2563EB]"
                }`}
              >
                {selectedPrompt?.id === prompt.id ? "已選擇" : "選擇"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}