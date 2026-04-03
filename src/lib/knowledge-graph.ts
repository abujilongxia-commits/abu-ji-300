/**
 * 知識圖譜系統 - 智能爆炸圖分析
 * 三層索引：專業資料庫 → Wikipedia → MiniMax AI 分析
 */

import fs from "fs";
import path from "path";

const API_BASE = "https://api.minimax.io";

// ==================== 第一層：專業領域資料庫 ====================

interface ComponentDef {
  name: string;
  description: string;
  layer: number; // 從內到外的層次
  subcomponents?: string[];
}

interface ObjectCategory {
  name: string;
  components: ComponentDef[];
  description: string;
  source: "domain_db";
}

// Professional Domain Database - Electronics, Vehicles, Instruments, etc.
const DOMAIN_DATABASE: Record<string, ObjectCategory> = {
  // ========== Electronics ==========
  "smartphone": {
    name: "Smartphone",
    description: "Modern mobile communication device",
    source: "domain_db",
    components: [
      { name: "Glass Panel", description: "Corning Gorilla Glass, protects touchscreen", layer: 1 },
      { name: "Optical Adhesive Layer", description: "Optical clear adhesive for screen bonding", layer: 2 },
      { name: "Display Panel", description: "AMOLED screen display", layer: 3 },
      { name: "Touch Sensor", description: "Capacitive touch circuit layer", layer: 4 },
      { name: "Mainboard", description: "PCB with processor and memory", layer: 5 },
      { name: "Thermal Graphite Sheet", description: "Heat-dissipating graphite film", layer: 6 },
      { name: "Battery Module", description: "Li-polymer battery, 4000mAh capacity", layer: 7 },
      { name: "Linear Motor", description: "Haptic feedback vibration module", layer: 8 },
      { name: "Camera Module", description: "Triple lens system: wide, ultra-wide, telephoto", layer: 9 },
      { name: "Speaker Module", description: "Stereo speakers and microphone array", layer: 10 },
      { name: "Metal Frame", description: "Aerospace-grade stainless steel frame", layer: 11 },
      { name: "Rear Glass Panel", description: "Matte glass back, supports MagSafe charging", layer: 12 },
    ],
  },
  "smartphone_generic": {
    name: "Smartphone",
    description: "Modern mobile communication device",
    source: "domain_db",
    components: [
      { name: "Glass Panel", description: "Corning Gorilla Glass, protects touchscreen", layer: 1 },
      { name: "Display Panel", description: "AMOLED or LCD screen", layer: 2 },
      { name: "Mainboard", description: "PCB with processor and memory", layer: 3 },
      { name: "Battery Module", description: "Li-polymer battery", layer: 4 },
      { name: "Camera Module", description: "Main, ultra-wide, telephoto lens system", layer: 5 },
      { name: "Cooling Module", description: "Thermal pad or heat pipe cooling system", layer: 6 },
      { name: "Metal Mid-Frame", description: "Aluminum or stainless steel frame", layer: 7 },
      { name: "Rear Shell Panel", description: "Glass or plastic back panel", layer: 8 },
    ],
  },
  "laptop": {
    name: "Laptop",
    description: "Portable personal computer",
    source: "domain_db",
    components: [
      { name: "Top Cover", description: "Aluminum CNC machined shell, protects screen", layer: 1 },
      { name: "Display Panel", description: "14-inch IPS or OLED, 2560x1600 resolution", layer: 2 },
      { name: "Display Cable", description: "Embedded display port cable", layer: 3 },
      { name: "Mainboard", description: "M3 chip with unified memory", layer: 4, subcomponents: ["M3 Processor", "18GB Memory", "SSD Controller"] },
      { name: "Cooling Fan", description: "Dual fan cooling system with heat pipes", layer: 5, subcomponents: ["Fan x2", "Heat Pipe", "Radiator Fins"] },
      { name: "Keyboard Assembly", description: "Membrane or mechanical keyboard with touch bar", layer: 6, subcomponents: ["Scissor Structure", "Touch Bar", "Backlight Module"] },
      { name: "Trackpad", description: "Force-sensing trackpad with haptic feedback", layer: 7 },
      { name: "Battery Module", description: "Li-polymer battery, 18-hour battery life", layer: 8 },
      { name: "Bottom Shell", description: "One-piece aluminum bottom case", layer: 9 },
      { name: "Speakers", description: "High-fidelity speakers with spatial audio", layer: 10 },
      { name: "Ports", description: "High-speed transfer, USB-C, MagSafe charging port", layer: 11 },
    ],
  },
  "tablet": {
    name: "Tablet",
    description: "Touchscreen portable device",
    source: "domain_db",
    components: [
      { name: "Glass Panel", description: "Protective glass with integrated fingerprint sensor", layer: 1 },
      { name: "Touch Sensor Layer", description: "Multi-touch capacitive sensor", layer: 2 },
      { name: "Display Panel", description: "High-resolution IPS or OLED screen", layer: 3 },
      { name: "Mainboard", description: "High-performance chip motherboard", layer: 4 },
      { name: "Battery Module", description: "High-capacity Li-polymer battery", layer: 5 },
      { name: "Camera Module", description: "Front and rear camera system", layer: 6 },
      { name: "Speakers and Microphone", description: "Quad speaker system with microphone array", layer: 7 },
      { name: "Aluminum Frame", description: "One-piece body construction", layer: 8 },
      { name: "Smart Connector", description: "For keyboard accessory connection", layer: 9 },
    ],
  },
  "headphones": {
    name: "Over-Ear Headphones",
    description: "Over-ear active noise cancelling headphones",
    source: "domain_db",
    components: [
      { name: "Headband Pad", description: "Memory foam with protein leather cover, pressure-relief design", layer: 1 },
      { name: "Headband Frame", description: "Stainless steel or aluminum adjustable headband", layer: 2 },
      { name: "Headband Hinge", description: "Foldable hinge, 180-degree rotation", layer: 3 },
      { name: "Earcup Shell", description: "Polished plastic shell", layer: 4 },
      { name: "Earpad", description: "Memory foam with fabric or leather cover", layer: 5 },
      { name: "Driver Unit", description: "40mm custom dynamic driver, 4Hz-40kHz frequency response", layer: 6 },
      { name: "ANC Module", description: "Feedforward + feedback microphones, noise cancellation chip", layer: 7, subcomponents: ["ANC Microphone x4", "Bluetooth Chip", "Accelerometer"] },
      { name: "Control Circuit Board", description: "Bluetooth antenna, control buttons, indicator LEDs", layer: 8 },
      { name: "Battery", description: "Li-ion rechargeable battery, 30-hour battery life", layer: 9 },
      { name: "Cable", description: "Universal charging cable, 3.5mm audio cable", layer: 10 },
    ],
  },
  "camera": {
    name: "Digital SLR Camera",
    description: "Interchangeable lens digital camera",
    source: "domain_db",
    components: [
      { name: "Body Shell", description: "Magnesium alloy body, dust and drip resistant", layer: 1 },
      { name: "Shutter Assembly", description: "Mechanical electronic shutter, max 1/8000s", layer: 2 },
      { name: "Mirror Box", description: "Pentaprism and mirror mechanism", layer: 3 },
      { name: "Image Sensor", description: "Full-frame 42MP image sensor", layer: 4 },
      { name: "Image Processing Engine", description: "High-performance image processor", layer: 5 },
      { name: "Autofocus Module", description: "759 phase-detection points, eye-tracking AF", layer: 6 },
      { name: "Body Image Stabilization", description: "5-axis 7-stop IBIS", layer: 7 },
      { name: "Hot Shoe and Contacts", description: "Standard hot shoe, supports flash", layer: 8 },
      { name: "Flip Screen", description: "3-inch flip-out touchscreen", layer: 9 },
      { name: "Electronic Viewfinder", description: "0.5-inch 3.69M dot EVF", layer: 10 },
      { name: "Memory Card Slot", description: "Dual SD card slots", layer: 11 },
      { name: "Li-ion Battery", description: "High-capacity battery, approx 600 shots", layer: 12 },
    ],
  },
  "drone": {
    name: "Quadcopter Drone",
    description: "Consumer aerial photography drone",
    source: "domain_db",
    components: [
      { name: "Propeller Blades", description: "Foldable quick-release propeller, 8.5 inch diameter", layer: 1 },
      { name: "Motor", description: "Brushless DC motor with built-in ESC", layer: 2 },
      { name: "Arm Structure", description: "Carbon fiber or plastic lightweight arm", layer: 3 },
      { name: "Flight Controller", description: "IMU, barometer, GPS, compass integrated module", layer: 4, subcomponents: ["3-axis Gyroscope", "Barometer", "GPS Module", "Vision Positioning Sensor"] },
      { name: "Gimbal Camera", description: "3-axis mechanical stabilization gimbal camera, 4K/60fps", layer: 5 },
      { name: "Obstacle Sensor", description: "Front, rear, bottom vision and infrared sensors", layer: 6 },
      { name: "Body Shell", description: "One-piece plastic shell, aerodynamic design", layer: 7 },
      { name: "Battery Compartment", description: "Intelligent flight battery, 3850mAh capacity", layer: 8 },
      { name: "Control Circuit Board", description: "Video transmission system, control signal processing", layer: 9, subcomponents: ["Video Chip", "Antenna Module", "LED Indicator"] },
      { name: "Landing Gear", description: "Retractable landing gear", layer: 10 },
    ],
  },
  // ========== Transportation ==========
  "car": {
    name: "Car",
    description: "Four-wheel internal combustion or electric vehicle",
    source: "domain_db",
    components: [
      { name: "Roof Rack", description: "Roof longitudinal and cross bars, 75kg capacity", layer: 1 },
      { name: "Panoramic Sunroof", description: "Electric sunshade anti-pinch solar roof integrated", layer: 2 },
      { name: "Roof Shell", description: "One-piece roof panel, laminated glass design", layer: 3 },
      { name: "ABC Pillars", description: "A/B/C pillar body structure steel, rollover safety", layer: 4 },
      { name: "Front Windshield", description: "Laminated safety glass, HUD integration", layer: 5 },
      { name: "Dashboard Assembly", description: "Full LCD instrument cluster and center console screen", layer: 6, subcomponents: ["12.3-inch instrument screen", "15.6-inch center console", "HUD display"] },
      { name: "Steering Wheel Assembly", description: "Leather steering wheel with heating and driver assist buttons", layer: 7 },
      { name: "Seat Assembly", description: "Electric adjustable seats with ventilation and heating", layer: 8, subcomponents: ["Front seats x2", "Rear seats", "Seat belts"] },
      { name: "Door Interior Panel", description: "Door panel, armrest, speakers", layer: 9 },
      { name: "Center Console Assembly", description: "Glove box, wireless charging, storage space", layer: 10 },
      { name: "Transmission", description: "CVT or 8AT automatic", layer: 11 },
      { name: "Engine Hood", description: "Front body structure, engine sound insulation", layer: 12 },
      { name: "Engine/Motor Assembly", description: "Turbocharged engine or pure electric motor", layer: 13, subcomponents: ["2.0L Turbo engine", "8AT transmission", "Engine mount"] },
      { name: "Chassis Suspension System", description: "Front MacPherson, rear multi-link suspension", layer: 14, subcomponents: ["Shock absorber", "Spring", "Anti-roll bar"] },
      { name: "Brake System", description: "Ventilated disc brake, ABS anti-lock system", layer: 15, subcomponents: ["Front disc x2", "Rear disc x2", "Brake caliper", "Brake master cylinder"] },
      { name: "Chassis Frame", description: "High-rigidity frame base, protects fuel tank and battery", layer: 16 },
      { name: "Wheel Assembly", description: "Aluminum alloy wheels and high-performance tires", layer: 17, subcomponents: ["19-inch aluminum rim x4", "235/45R19 tire", "Hub bearing"] },
    ],
  },
  "motorcycle": {
    name: "Motorcycle",
    description: "Two-wheel motor vehicle",
    source: "domain_db",
    components: [
      { name: "Headlight", description: "LED projector headlight, DRL guide strip", layer: 1 },
      { name: "Windshield", description: "Transparent wind deflector, aerodynamic design", layer: 2 },
      { name: "Instrument Cluster", description: "Full LCD instrument, RPM, speed, odometer", layer: 3 },
      { name: "Fuel Tank Shell", description: "Metal fuel tank with plastic fairing", layer: 4 },
      { name: "Seat Cushion", description: "Leather saddle, double-seat design", layer: 5 },
      { name: "Engine Body", description: "Four-stroke water-cooled engine, 649cc displacement", layer: 6, subcomponents: ["Cylinder head", "Crankcase", "Transmission mechanism", "Water cooling system"] },
      { name: "Exhaust Pipe", description: "Stainless steel exhaust with catalytic converter", layer: 7 },
      { name: "Rear Swing Arm", description: "Aluminum rear swing arm, connects rear wheel to body", layer: 8 },
      { name: "Rear Shock Absorber", description: "Multi-adjustable rear shock, linkage design", layer: 9 },
      { name: "Chain Drive", description: "530 sealed chain and sprocket", layer: 10 },
      { name: "Rear Wheel Assembly", description: "Aluminum alloy wheel and tire", layer: 11 },
      { name: "Main Frame", description: "Welded steel tube frame or aluminum frame", layer: 12 },
      { name: "Front Fork Assembly", description: "Inverted front fork, adjustable damping", layer: 13 },
      { name: "Front Wheel Assembly", description: "Radial caliper ventilated disc, front hub", layer: 14 },
      { name: "Handlebar Switch", description: "Ignition lock, high beam, turn signal switch", layer: 15 },
    ],
  },
  // ========== Instruments ==========
  "guitar": {
    name: "Electric Guitar",
    description: "Six-string electric guitar",
    source: "domain_db",
    components: [
      { name: "Headstock", description: "Brand logo and tuning peg housing", layer: 1 },
      { name: "Tuning Machines", description: "Closed or open gear tuners", layer: 2 },
      { name: "Neck", description: "Maple or rosewood fretboard, 22-fret design", layer: 3 },
      { name: "Frets", description: "Nickel silver frets, medium gauge", layer: 4 },
      { name: "Inlay", description: "Mother of pearl dots or special pattern", layer: 5 },
      { name: "Body", description: "Ash or mahogany, single/double coil design", layer: 6 },
      { name: "Pickups", description: "Single coil or humbucker magnetic pickups x2 or x3", layer: 7 },
      { name: "Bridge", description: "Double-locking or fixed bridge", layer: 8 },
      { name: "Whammy Bar", description: "Synchronized tremolo, multi-segment tension adjustment", layer: 9 },
      { name: "Tone/Volume Knobs", description: "Potentiometer switch, 500k or 250k", layer: 10 },
      { name: "3-Way Pickup Selector", description: "Neck/bridge/combination switch", layer: 11 },
      { name: "Output Jack", description: "1/4-inch headphone jack", layer: 12 },
      { name: "Bridge Components", description: "Nut and bridge slot", layer: 13 },
      { name: "Strings", description: ".009-.042 nickel-plated steel strings", layer: 14 },
      { name: "Sound Hole", description: "Single or double cutaway design", layer: 15 },
    ],
  },
  "piano": {
    name: "Grand Piano",
    description: "Traditional grand piano",
    source: "domain_db",
    components: [
      { name: "Case", description: "Solid wood or MDF shell, black or white piano lacquer", layer: 1 },
      { name: "Lid", description: "Hydraulic slow-close lid, full or half open", layer: 2 },
      { name: "Music Desk", description: "Adjustable angle music stand", layer: 3 },
      { name: "Keyboard", description: "88 keys ivory-white imitation wood black keys", layer: 4, subcomponents: ["52 white keys", "36 black keys", "Balance weight"] },
      { name: "Keybed", description: "Aluminum keyboard base support frame", layer: 5 },
      { name: "Action", description: "Carbon fiber or wood action structure", layer: 6, subcomponents: ["Hammer shank", "Elk leather", "Dampers"] },
      { name: "Hammers", description: "Wool hammers, wrapped with felt", layer: 7 },
      { name: "Strings", description: "German steel wire, wound strings for bass", layer: 8, subcomponents: ["88 high strings", "Mid-bass wound strings"] },
      { name: "Frame", description: "Cast iron frame, supports 20 tons of string tension", layer: 9 },
      { name: "Soundboard", description: "Solid spruce soundboard, tapered design", layer: 10 },
      { name: "Pin Block", description: "Dakota or maple multi-layer plywood", layer: 11 },
      { name: "Pedals", description: "Three pedals: soft, sostenuto, sustain", layer: 12, subcomponents: ["Soft pedal", "Sostenuto pedal", "Sustain pedal"] },
      { name: "Legs", description: "Turned legs with casters", layer: 13 },
    ],
  },
  // ========== Kitchen Appliances ==========
  "coffee machine": {
    name: "Semi-Automatic Espresso Machine",
    description: "Espresso coffee machine",
    source: "domain_db",
    components: [
      { name: "Machine Shell", description: "Polished stainless steel or plastic shell", layer: 1 },
      { name: "Control Panel", description: "Buttons or touchscreen, pressure/temperature display", layer: 2 },
      { name: "Portafilter", description: "58mm commercial-grade portafilter handle", layer: 3 },
      { name: "Brew Group", description: "E61 lever or rotary pump brew unit", layer: 4 },
      { name: "Boiler", description: "Brass boiler, 0.3-2L capacity", layer: 5 },
      { name: "Pump", description: "Rotary or vibration pump, max 15 bar pressure", layer: 6 },
      { name: "Heat Exchanger", description: "Mother-daughter boiler heat exchange, radiator", layer: 7 },
      { name: "Water Tank", description: "2-4L removable water tank with level sensor", layer: 8 },
      { name: "Drip Tray", description: "Removable stainless steel drip tray", layer: 9 },
      { name: "Steam Wand", description: "Rotatable commercial steam wand, adjustable angle", layer: 10 },
      { name: "Spout", description: "Double or triple hole professional spout", layer: 11 },
      { name: "Power Cord and Socket", description: "Grounded three-pin power cord", layer: 12 },
    ],
  },
  // ========== Sports Equipment ==========
  "basketball": {
    name: "Basketball",
    description: "Standard indoor/outdoor basketball",
    source: "domain_db",
    components: [
      { name: "Outer Rubber Layer", description: "Wear-resistant rubber outer skin, channel design", layer: 1 },
      { name: "Nylon Winding Layer", description: "Nylon winding for structural strength", layer: 2 },
      { name: "Bladder", description: "Butyl rubber inner bladder, excellent air retention", layer: 3 },
      { name: "Valve", description: "American valve, standard pressure 7.5-8.5 psi", layer: 4 },
    ],
  },
  // ========== Mechanical/Tools ==========
  "mechanical keyboard": {
    name: "Mechanical Keyboard",
    description: "Keyboard using mechanical switches",
    source: "domain_db",
    components: [
      { name: "Keycaps", description: "PBT or ABS plastic keycaps, OEM profile", layer: 1 },
      { name: "Switches", description: "Cherry MX or similar mechanical switches, hot-swap support", layer: 2 },
      { name: "Switch Plate", description: "Aluminum or steel mounting plate", layer: 3 },
      { name: "PCB Circuit Board", description: "Fiberglass PCB, full-key anti-ghosting support", layer: 4 },
      { name: "Silicone Dampening Pad", description: "Silicone pad to reduce typing noise", layer: 5 },
      { name: "Metal Bottom Plate", description: "Aluminum bottom shell CNC machining", layer: 6 },
      { name: "USB-C Cable", description: "Detachable USB-C cable", layer: 7 },
      { name: "Indicator LED Module", description: "Caps/Num/Scroll LED indicators", layer: 8 },
      { name: "Wrist Rest", description: "Magnetic or detachable memory foam wrist rest", layer: 9 },
    ],
  },
};

// ==================== 第二層：Wikipedia 查詢 ====================

interface WikipediaResult {
  title: string;
  extract: string; // 文章摘要
  components?: ComponentDef[];
  source: "wikipedia";
}

// Chinese to English translation map for common object names
const CHINESE_TO_ENGLISH: Record<string, string> = {
  // Electronics
  "智能手机": "smartphone",
  "手机": "mobile phone",
  "电脑": "computer",
  "笔记本电脑": "laptop",
  "平板": "tablet",
  "耳机": "headphones",
  "相机": "camera",
  "数码相机": "digital camera",
  "单反相机": "DSLR camera",
  "无反相机": "mirrorless camera",
  "无人机": "drone",
  "智能手表": "smartwatch",
  // Transportation
  "汽车": "car",
  "电动车": "electric car",
  "摩托车": "motorcycle",
  "自行车": "bicycle",
  "电动车": "electric bicycle",
  // Instruments & Audio
  "吉他": "guitar",
  "电吉他": "electric guitar",
  "钢琴": "piano",
  "钢琴": "grand piano",
  "麦克风": "microphone",
  "扬声器": "speaker",
  "蓝牙音箱": "bluetooth speaker",
  // Home appliances
  "咖啡机": "coffee machine",
  "咖啡机": "espresso machine",
  "冰箱": "refrigerator",
  "空调": "air conditioner",
  "洗衣机": "washing machine",
  // Other
  "游戏机": "gaming console",
  "望远镜": "telescope",
  "机械键盘": "mechanical keyboard",
  "篮球": "basketball",
};

// Common aliases/variations for objects
const OBJECT_ALIASES: Record<string, string[]> = {
  "smartphone": ["mobile phone", "cell phone", "cellphone", "iphone", "android phone"],
  "car": ["automobile", "vehicle", "motor car", "auto"],
  "laptop": ["notebook computer", "notebook", "portable computer"],
  "headphones": ["headset", "earphones", "wireless headphones", "over-ear headphones"],
  "camera": ["digital camera", "compact camera", "camera body"],
  "drone": ["quadcopter", "uav", "unmanned aerial vehicle"],
  "guitar": ["acoustic guitar", "electric guitar", "string instrument"],
  "piano": ["grand piano", "upright piano", "acoustic piano"],
};

// Wikipedia i18n language codes for multi-language fallback
const WIKIPEDIA_LANGS = ["en", "zh", "ja", "es", "fr", "de"];

// Try to translate Chinese name to English
function translateToEnglish(objectName: string): string {
  const lower = objectName.toLowerCase().trim();

  // Direct mapping
  if (CHINESE_TO_ENGLISH[objectName]) {
    return CHINESE_TO_ENGLISH[objectName];
  }
  if (CHINESE_TO_ENGLISH[lower]) {
    return CHINESE_TO_ENGLISH[lower];
  }

  // Check for partial matches
  for (const [cn, en] of Object.entries(CHINESE_TO_ENGLISH)) {
    if (lower.includes(cn) || cn.includes(lower)) {
      return en;
    }
  }

  return objectName;
}

// Get search variations for an object name
function getSearchVariations(objectName: string): string[] {
  const variations = new Set<string>();

  // Add original name
  variations.add(objectName);

  // Add translated version if different
  const english = translateToEnglish(objectName);
  if (english !== objectName) {
    variations.add(english);
    // Also add aliases for the English version
    const aliases = OBJECT_ALIASES[english.toLowerCase()];
    if (aliases) {
      aliases.forEach(a => variations.add(a));
    }
  }

  // Add common suffixes/variations
  const lower = objectName.toLowerCase();
  if (!lower.endsWith("s") && !lower.endsWith("机") && !lower.endsWith("器")) {
    variations.add(objectName + "s");
  }

  return Array.from(variations);
}

// Search Wikipedia with multiple language fallbacks
async function searchWikipediaMultiLang(searchTerm: string): Promise<string | null> {
  for (const lang of WIKIPEDIA_LANGS) {
    try {
      const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=1&format=json`;
      const response = await fetch(searchUrl);

      if (response.ok) {
        const data = await response.json();
        const titles: string[] = data[1];
        if (titles && titles.length > 0) {
          console.log(`[KnowledgeGraph] Wikipedia hit: "${titles[0]}" (${lang})`);
          return titles[0];
        }
      }
    } catch (e) {
      // Continue to next language
    }
  }
  return null;
}

// Fetch page content with infobox data and sections
async function fetchPageContent(title: string): Promise<{ extract: string; infobox: string; sections: string[] } | null> {
  try {
    // Get page extract and additional content (full content for infobox parsing)
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|revisions&exintro=false&explaintext=true&rvprop=content&format=json`;
    const response = await fetch(contentUrl);

    if (!response.ok) return null;

    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;

    const page = pages[pageId];
    const content = page.revisions?.[0]?.["*"] || page.extract || "";

    // Extract infobox
    let infobox = "";
    const infoboxMatch = content.match(/\{\{Infobox[\s\S]*?(?=\n\n|\n=)/i);
    if (infoboxMatch) {
      infobox = infoboxMatch[0];
    }

    // Extract section headings
    const sections: string[] = [];
    const sectionMatches = content.match(/\n==\s*([^=]+)\s*==\n/g);
    if (sectionMatches) {
      for (const match of sectionMatches) {
        const section = match.replace(/\n==\s*/, "").replace(/\s*==\n/, "").trim();
        if (section) sections.push(section);
      }
    }

    return {
      extract: page.extract || content.substring(0, 5000),
      infobox,
      sections,
    };
  } catch (e) {
    return null;
  }
}

// Extract components from infobox
function extractComponentsFromInfobox(infobox: string, existingComponents: ComponentDef[]): ComponentDef[] {
  const components: ComponentDef[] = [...existingComponents];
  const componentNames = new Set(components.map(c => c.name.toLowerCase()));

  // Common infobox fields that indicate components
  const componentFields = [
    "components", "parts", "elements", "features", "specifications",
    "structure", "architecture", "hardware", "software", "accessories",
    // Chinese fields
    "组件", "部件", "零件", "组成部分",
  ];

  for (const field of componentFields) {
    const fieldRegex = new RegExp(`${field}\\s*=\\s*([^\\n]+)`, "i");
    const match = infobox.match(fieldRegex);
    if (match) {
      const value = match[1];
      // Extract list items (often separated by comma, newline, or *)
      const items = value.split(/[,;*|\n]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 50);
      for (const item of items) {
        // Clean up the item - remove wiki markup, links, etc.
        const cleanName = item.replace(/\[\[|\]\]/g, "").replace(/\{\{[^}]+\}\}/g, "").replace(/<[^>]+>/g, "").trim();
        if (cleanName && !componentNames.has(cleanName.toLowerCase())) {
          componentNames.add(cleanName.toLowerCase());
          components.push({
            name: cleanName,
            description: `Extracted from infobox: ${field}`,
            layer: components.length + 1,
          });
        }
      }
    }
  }

  return components;
}

// Extract components from article sections
function extractComponentsFromSections(sections: string[], extract: string): ComponentDef[] {
  const components: ComponentDef[] = [];
  const seen = new Set<string>();

  // Section names that typically describe components or parts
  const componentSections = [
    "components", "parts", "structure", "design", "hardware",
    "features", "specifications", "anatomy", "construction",
    // Chinese
    "结构", "组成", "部件", "零件", "构造", "设计",
  ];

  for (const section of sections) {
    const lower = section.toLowerCase();
    if (componentSections.some(cs => lower.includes(cs))) {
      // This section likely contains component info
      // Extract capitalized phrases from section name
      const matches = section.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
      if (matches) {
        for (const match of matches) {
          if (match.length > 3 && match.length < 30 && !seen.has(match.toLowerCase())) {
            seen.add(match.toLowerCase());
            components.push({
              name: match,
              description: `Found in section: ${section}`,
              layer: components.length + 1,
            });
          }
        }
      }
    }
  }

  return components;
}

// Enhanced component extraction from text
function extractComponentsFromText(objectName: string, text: string): ComponentDef[] {
  const components: ComponentDef[] = [];
  const seen = new Set<string>();

  // Component-related keywords in multiple languages
  const componentKeywords = [
    // English
    "component", "part", "element", "contains", "includes", "consists of",
    "made of", "composed of", "equipped with", "features", "includes",
    // Chinese
    "由", "包含", "组成", "部件", "零件", "组件", "具有", "配有",
  ];

  // Phrases that precede component lists
  const listPatterns = [
    /(?:includes?|contains?|consists?\s+of|composed?\s+of|equipped?\s+with)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s*,?\s*(?:and|&)?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)*)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:components?|parts?|elements?)/gi,
    /(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+is\s+(?:a|an)\s+(?:main|major|key|primary)\s+component/gi,
  ];

  // First, try pattern matching for explicit component lists
  for (const pattern of listPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const componentList = match[1];
      const items = componentList.split(/\s*,?\s*(?:and|&|\s)\s*/);
      for (const item of items) {
        const cleanItem = item.trim();
        if (cleanItem.length > 2 && cleanItem.length < 40 && !seen.has(cleanItem.toLowerCase())) {
          seen.add(cleanItem.toLowerCase());
          components.push({
            name: cleanItem,
            description: `Explicitly listed component`,
            layer: components.length + 1,
          });
        }
      }
    }
  }

  // Then look for component keywords in sentences
  const sentences = text.split(/[.!?。]/).filter(s => s.trim().length > 10);

  for (const sentence of sentences) {
    if (components.length >= 12) break;

    const lowerSentence = sentence.toLowerCase();

    // Check if sentence contains component keywords
    const hasKeyword = componentKeywords.some(kw => lowerSentence.includes(kw));
    if (!hasKeyword) continue;

    // Extract capitalized noun phrases
    const matches = sentence.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        // Filter out generic words and duplicates
        const genericWords = ["The", "This", "That", "These", "Those", "It", "Which", "Where", "When", "What", "How", objectName];
        if (match.length > 3 && match.length < 35 && !seen.has(match.toLowerCase()) && !genericWords.includes(match)) {
          seen.add(match.toLowerCase());
          components.push({
            name: match,
            description: sentence.trim().substring(0, 120),
            layer: components.length + 1,
          });
          break; // Only take first meaningful match per sentence
        }
      }
    }
  }

  // Infer components from structural descriptions
  // Look for patterns like "X has a Y" or "Y is located/positioned"
  const structuralPatterns = [
    /(?:has|have|possesses?)\s+(?:a|an|the)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /(?:features?|includes?)\s+(?:a|an|the)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
  ];

  for (const pattern of structuralPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const potential = match[1];
      if (potential.length > 3 && potential.length < 35 && !seen.has(potential.toLowerCase())) {
        // Check it's not a generic word
        const genericCheck = ["battery", "screen", "display", "camera", "speaker", "microphone", "processor", "memory", "storage"];
        if (!genericCheck.includes(potential.toLowerCase())) {
          seen.add(potential.toLowerCase());
          components.push({
            name: potential,
            description: "Inferred from structural description",
            layer: components.length + 1,
          });
        }
      }
    }
  }

  return components;
}

// Enhanced Wikipedia query function with multi-language support and improved component extraction
export async function fetchWikipediaComponents(objectName: string): Promise<WikipediaResult | null> {
  try {
    // Generate search variations (English, Chinese, aliases)
    const searchVariations = getSearchVariations(objectName);
    console.log(`[KnowledgeGraph] Search variations: ${searchVariations.join(", ")}`);

    let bestTitle: string | null = null;
    let bestExtract = "";
    let infoboxData = "";
    let sections: string[] = [];

    // Try each variation with multi-language Wikipedia search
    for (const variation of searchVariations) {
      const title = await searchWikipediaMultiLang(variation);
      if (title) {
        bestTitle = title;
        const content = await fetchPageContent(title);
        if (content) {
          bestExtract = content.extract;
          infoboxData = content.infobox;
          sections = content.sections;
          break; // Got a good result
        }
      }
    }

    // If no results from variations, try direct search on all languages
    if (!bestTitle) {
      console.log(`[KnowledgeGraph] Trying direct multi-lang search for: ${objectName}`);
      bestTitle = await searchWikipediaMultiLang(objectName);
      if (bestTitle) {
        const content = await fetchPageContent(bestTitle);
        if (content) {
          bestExtract = content.extract;
          infoboxData = content.infobox;
          sections = content.sections;
        }
      }
    }

    if (!bestTitle) {
      console.log(`[KnowledgeGraph] Wikipedia no results: ${objectName}`);
      return null;
    }

    console.log(`[KnowledgeGraph] Wikipedia found: ${bestTitle}`);

    // Extract components using multiple strategies
    let components: ComponentDef[] = [];

    // 1. Extract from infobox
    if (infoboxData) {
      components = extractComponentsFromInfobox(infoboxData, components);
      console.log(`[KnowledgeGraph] Infobox extraction: ${components.length} components`);
    }

    // 2. Extract from sections
    if (sections.length > 0) {
      const sectionComponents = extractComponentsFromSections(sections, bestExtract);
      for (const comp of sectionComponents) {
        if (!components.some(c => c.name.toLowerCase() === comp.name.toLowerCase())) {
          components.push(comp);
        }
      }
      console.log(`[KnowledgeGraph] Section extraction: ${sectionComponents.length} components, total: ${components.length}`);
    }

    // 3. Extract from text using enhanced heuristics
    const textComponents = extractComponentsFromText(objectName, bestExtract);
    for (const comp of textComponents) {
      if (!components.some(c => c.name.toLowerCase() === comp.name.toLowerCase())) {
        components.push(comp);
      }
    }
    console.log(`[KnowledgeGraph] Text extraction: ${textComponents.length} components, total: ${components.length}`);

    // Filter out low-quality components
    components = components.filter(c => {
      // Must have reasonable name length
      if (c.name.length < 2 || c.name.length > 40) return false;
      // Must not be too generic
      const genericTerms = ["thing", "stuff", "item", "object", "device", "unit", "part", "element"];
      if (genericTerms.includes(c.name.toLowerCase())) return false;
      // Must have some description
      if (!c.description || c.description.length < 5) return false;
      return true;
    });

    // Re-number layers
    components = components.map((c, i) => ({ ...c, layer: i + 1 }));

    // Limit to reasonable number
    if (components.length > 15) {
      components = components.slice(0, 15);
    }

    return {
      title: bestTitle,
      extract: bestExtract.substring(0, 1000),
      components,
      source: "wikipedia",
    };
  } catch (error) {
    console.error(`[KnowledgeGraph] Wikipedia query error: ${error}`);
    return null;
  }
}

// ==================== 第三層：MiniMax AI 分析 ====================

interface AIAnalysisResult {
  objectName: string;
  components: ComponentDef[];
  explanation: string;
  source: "ai";
}

// 使用 MiniMax Chat API 分析物件結構
export async function analyzeWithAI(objectName: string, targetCount: number = 6): Promise<AIAnalysisResult | null> {
  const API_KEY = process.env.MINIMAX_API_KEY;
  if (!API_KEY) {
    console.error("[KnowledgeGraph] MINIMAX_API_KEY not set");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/v1/text/chatcompletion_v2`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        messages: [
          {
            role: "system",
            content: `You are a senior mechanical engineer and product teardown specialist with expertise in functional decomposition analysis. Your task is to perform rigorous structural analysis of objects and identify their constituent components with precision.

## ANALYSIS METHODOLOGY

Apply a systematic layered decomposition approach:
1. OUTER SHELL/HOUSING (Layer 1): External enclosure, protective covers, bezels
2. DISPLAY/INTERFACE LAYER (Layers 2-3): User-facing components, screens, control panels
3. PRIME MOVER/POWER SYSTEMS (mid-layers): Motors, engines, batteries, heating elements
4. COMPUTATION/CONTROL CORE (central layers): PCBs, processors, control circuits
5. MECHANICAL TRANSMISSION (inner layers): Gears, linkages, shafts, bearings
6. STRUCTURAL FRAMEWORK (core): Load-bearing structures, frames, chassis
7. CONSUMABLES/ATTACHMENTS (outer or detachable): Accessories, fasteners, seals

## COMPONENT VALIDATION RULES

CRITICAL: Each component MUST satisfy ALL of the following:
- Physically exists as a discrete, separable part
- Has a specific functional role in the object's operation
- Is structurally integral to the object (not random/unrelated)
- Can be described with technical specifications (material, dimensions, function)

REJECT components that are:
- Abstract concepts or processes (e.g., "convenience", "innovation")
- Generic adjectives disguised as parts (e.g., "quality", "precision")
- Random internal object names with no functional relationship
- Duplicates or overlapping with other components

## OUTPUT FORMAT (STRICT JSON)

{
  "components": [
    {
      "name": "Exact technical component name (English, noun phrase, 2-5 words)",
      "description": "Technical description: material composition, dimensional specs, functional role, interface connections. Be precise and engineering-specific.",
      "layer": integer (1=outermost, sequential inward),
      "subcomponents": ["optional: critical sub-assemblies or parts within this component"]
    }
  ],
  "explanation": "Technical overview: object classification, functional domain, design philosophy, key engineering features. 2-3 sentences."
}

## EXAMPLE: Smartphone Component Analysis

Input: "smartphone"
Output:
{
  "components": [
    {
      "name": "Tempered Glass Display",
      "description": "Corning Gorilla Glass Victus 2, 6.7-inch capacitive multi-touch sensor layer with oleophobic coating, 0.55mm thickness, Mohs hardness 9",
      "layer": 1,
      "subcomponents": ["Glass substrate", "Touch sensor grid", "Anti-reflective coating"]
    },
    {
      "name": "AMOLED Display Panel",
      "description": "6.7-inch active-matrix organic LED panel, 2796x1290 resolution, 460 ppi, 120Hz ProMotion, 2000 nits peak brightness",
      "layer": 2
    },
    {
      "name": "A-series Chip Module",
      "description": "3nm TSMC N3E silicon, 6-core CPU (2 performance + 4 efficiency), 16-core Neural Engine, 8GB LPDDR5X unified memory",
      "layer": 3,
      subcomponents: ["Processor die", "Memory stack", "Thermal interface material"]
    },
    {
      "name": "Lithium-polymer Battery",
      "description": "4422mAh multi-layer LiPo cell, 3.86V nominal voltage, integrated BMS with cell balancing, wireless charging coil integrated",
      "layer": 4
    },
    {
      "name": "Titanium Frame",
      "description": "Grade 5 titanium alloy mid-frame, aerospace-grade, micro-blasted surface, structural reinforcement for drop protection",
      "layer": 5
    },
    {
      "name": "Triple-lens Camera Module",
      "description": "48MP wide (f/1.78) + 12MP ultra-wide (f/2.2) + 12MP telephoto (f/2.8, 5x optical), sensor-shift OIS, LiDAR scanner",
      "layer": 6
    }
  ],
  "explanation": "Modern smartphone采用了紧凑的层压结构设计，外层为玻璃显示模组，中层为计算平台和电池，核心为钛金属框架支撑。设计重点在轻薄化与耐用性的平衡，采用系统级封装技术最大化空间利用率。"
}

## EXAMPLE: Mechanical Keyboard Analysis

Input: "mechanical keyboard"
Output:
{
  "components": [
    {
      "name": "PBT Keycaps",
      "description": "Polybutylene terephthalate keycaps, OEM profile, double-shot legends, 0.8mm wall thickness, compatible with Cherry MX stem",
      "layer": 1
    },
    {
      "name": "Mechanical Switches",
      "description": "Hot-swap PCB-mount mechanical switches, 5-pin Cherry MX compatible, 45g actuation force, 2mm pre-travel, 4mm total travel",
      "layer": 2,
      subcomponents": ["Stem", "Spring", "Housing", "Contact leaf"]
    },
    {
      "name": "Aluminum Switch Plate",
      "description": "1.5mm 6063-T5 aluminum alloy mounting plate, CNC machined, anodized finish, provides rigidity and typographic feedback",
      "layer": 3
    },
    {
      "name": "FR4 PCB",
      "description": "Fiberglass-reinforced epoxy PCB, full N-key rollover, per-key RGB LED drivers, gold-plated contact pads",
      "layer": 4
    },
    {
      "name": "Silicone Dampening Pad",
      "description": "3mm silicone rubber sheet, die-cut to plate form, reduces hollowness and improves typing acoustics",
      "layer": 5
    },
    {
      "name": "Aluminum Bottom Housing",
      "description": "CNC machined aluminum bottom shell, 3.5mm thickness, integrated tilt feet, USB-C cutout",
      "layer": 6
    }
  ],
  "explanation": "机械键盘采用分层式结构设计，从外到内依次为键帽、轴体、定位板、PCB和底壳。Gasket mount结构通过硅胶垫片提供弹性支撑，PCB承担信号传输和LED控制双重功能。"
}

## FINAL INSTRUCTION

Analyze the user's object "${objectName}" and generate exactly ${targetCount} components following the rules above. Focus on:
- Real, physically separable parts
- Genuine functional roles
- Professional engineering terminology
- Accurate layer ordering (outer=1, progressing inward)

Output valid JSON only. No markdown, no explanations outside the JSON structure.`,
          },
          {
            role: "user",
            content: `Perform a rigorous structural decomposition analysis of "${objectName}". Identify exactly ${targetCount} components with precise technical descriptions. Follow the engineering methodology and validation rules in your system prompt.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`[KnowledgeGraph] MiniMax API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return null;
    }

    // 解析 JSON 回應
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[KnowledgeGraph] Cannot parse AI response");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      objectName,
      components: parsed.components || [],
      explanation: parsed.explanation || "",
      source: "ai",
    };
  } catch (error) {
    console.error(`[KnowledgeGraph] AI analysis error: ${error}`);
    return null;
  }
}

// ==================== 主查詢介面 ====================

export interface ComponentResult {
  objectName: string;
  components: ComponentDef[];
  source: "domain_db" | "wikipedia" | "ai" | "fallback";
  confidence: number; // 0-1，可信度
  explanation?: string;
}

// 主查詢函數：三層索引
export async function getObjectComponents(
  objectName: string,
  targetCount: number = 6
): Promise<ComponentResult> {
  const lowerName = objectName.toLowerCase();

  // ========== 第一層：專業資料庫 ==========
  console.log(`[KnowledgeGraph] Querying domain database: ${objectName}`);

  // 精確匹配
  if (DOMAIN_DATABASE[lowerName]) {
    const db = DOMAIN_DATABASE[lowerName];
    console.log(`[KnowledgeGraph] ✓ Domain database hit: ${objectName}`);
    return {
      objectName: db.name,
      components: db.components.slice(0, targetCount),
      source: "domain_db",
      confidence: 1.0,
    };
  }

  // 部分匹配
  for (const [key, db] of Object.entries(DOMAIN_DATABASE)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      console.log(`[KnowledgeGraph] ✓ Domain database partial match: ${key}`);
      return {
        objectName: db.name,
        components: db.components.slice(0, targetCount),
        source: "domain_db",
        confidence: 0.9,
      };
    }
  }

  // ========== 第二層：Wikipedia ==========
  console.log(`[KnowledgeGraph] Querying Wikipedia: ${objectName}`);
  const wikiResult = await fetchWikipediaComponents(objectName);

  if (wikiResult && wikiResult.components && wikiResult.components.length >= 3) {
    console.log(`[KnowledgeGraph] ✓ Wikipedia hit: ${wikiResult.title}`);
    return {
      objectName: wikiResult.title,
      components: wikiResult.components.slice(0, targetCount),
      source: "wikipedia",
      confidence: 0.7,
      explanation: wikiResult.extract.substring(0, 200),
    };
  }

  // ========== 第三層：MiniMax AI ==========
  console.log(`[KnowledgeGraph] Using AI analysis: ${objectName}`);
  const aiResult = await analyzeWithAI(objectName, targetCount);

  if (aiResult && aiResult.components && aiResult.components.length >= 3) {
    console.log(`[KnowledgeGraph] ✓ AI analysis success: ${aiResult.components.length} components`);
    return {
      objectName: aiResult.objectName,
      components: aiResult.components.slice(0, targetCount),
      source: "ai",
      confidence: 0.9,
      explanation: aiResult.explanation,
    };
  }

  // ========== 萬用 fallback ==========
  console.log(`[KnowledgeGraph] ✗ All methods failed, using fallback: ${objectName}`);
  return {
    objectName,
    components: generateFallbackComponents(objectName, targetCount),
    source: "fallback",
    confidence: 0.3,
  };
}

// 萬用組件生成（當所有方法都失敗時）
function generateFallbackComponents(objectName: string, count: number): ComponentDef[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `${objectName} Component ${i + 1}`,
    description: `Core component ${i + 1} of ${objectName}`,
    layer: i + 1,
  }));
}

// 根據風格生成不同的提示詞
// MiniMax image-01 最大長邊 2048 pixels
const RESOLUTION_MAP: Record<string, { width: number; height: number }> = {
  "1:1": { width: 2048, height: 2048 },
  "16:9": { width: 2048, height: 1152 },
  "4:3": { width: 2048, height: 1536 },
  "3:2": { width: 2048, height: 1365 },
};

export function generatePromptFromComponents(
  objectName: string,
  components: ComponentDef[],
  style: "realistic" | "diagram" | "technical",
  aspectRatio: string
): string {
  const stylePrompts: Record<"realistic" | "diagram" | "technical", string> = {
    realistic: "Hyper-realistic product photography style, professional studio lighting with soft shadow layers, high dynamic range (HDR), macro photography texture reproduction, ultra-high resolution 8K detail, vivid natural material colors with accurate surface textures, National Geographic award-winning photography quality, precise depth of field",
    diagram: "Premium infographic visualization, vibrant gradient color palette distinguishing functional layers, holographic floating component effect, glassmorphism UI design, professional motion graphics standards, ultra-high resolution 4K detail, seamless layer separation with depth cues",
    technical: "Engineering exploded-view diagram, ANSI/ASME Y14.41 drafting standards compliance, precise dimension lines with measurement annotations, technical callout bubbles, professional CAD wireframe aesthetic, vibrant accent colors per component layer, ultra-high resolution vector-quality detail",
  };

  const resolution = RESOLUTION_MAP[aspectRatio] || RESOLUTION_MAP["16:9"];

  // Build structured component list with layer information (limit to avoid prompt overflow)
  const componentDescriptions = components.slice(0, 6).map(c => {
    const layerIndicator = `[Layer ${c.layer}]`;
    const subcomponents = c.subcomponents && c.subcomponents.length > 0
      ? ` (${c.subcomponents.slice(0, 2).join(", ")})`
      : "";
    return `${layerIndicator} ${c.name}: ${c.description}${subcomponents}`;
  }).join(" | ");

  // Build clean label list for visual clarity
  const componentLabels = components.slice(0, 6).map(c => `${c.name}`).join(", ");

  const prompt = `Create a vertical exploded-view infographic depicting the systematic functional decomposition of a ${objectName}. Arrange components as floating horizontal layers from bottom to top with proportional vertical spacing, each layer rendered with distinct vibrant color coding and subtle luminous edge effects. ${stylePrompts[style]}. Include elegant connector lines with gradient coloration linking each component to its annotation. Ultra-clear typographic details throughout.

COMPONENTS: ${componentDescriptions}

LABELS: ${componentLabels}

Resolution: ${resolution.width}x${resolution.height} pixels. All text in English.`;

  // Truncate prompt if exceeds 1400 chars (leaving room for angle suffix)
  return prompt.length > 1400 ? prompt.substring(0, 1400) + "..." : prompt;
}
