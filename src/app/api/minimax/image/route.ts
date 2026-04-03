import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.minimax.io";

// Camera angles for explosion diagrams
const CAMERA_ANGLES = [
  { id: "front", name: "正面視角", label: "Front View", suffix: "from the front view, straight-on perspective" },
  { id: "side", name: "側面視角", label: "Side View", suffix: "from the side view, 90-degree angle" },
  { id: "top", name: "頂部視角", label: "Top View", suffix: "from the top-down overhead perspective" },
  { id: "isometric", name: "等軸測視角", label: "Isometric", suffix: "isometric 3D perspective, 30-degree angles" },
  { id: "three-quarter", name: "三分視角", label: "Three-Quarter", suffix: "three-quarter view, showing front and side" },
  { id: "exploded-front", name: "爆炸正面", label: "Exploded Front", suffix: "fully exploded view from the front" },
  { id: "exploded-top", name: "爆炸頂部", label: "Exploded Top", suffix: "fully exploded view from the top" },
  { id: "exploded-isometric", name: "爆炸等軸測", label: "Exploded Iso", suffix: "fully exploded isometric 3D view" },
];

export async function POST(request: NextRequest) {
  const API_KEY = process.env.MINIMAX_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "MINIMAX_API_KEY environment variable is not set" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { prompt, aspect_ratio = "16:9", angles = ["front", "side", "isometric"] } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Generate multiple images with different angles (max 2)
    const imagePromises = angles.slice(0, 2).map(async (angleId: string) => {
      const angle = CAMERA_ANGLES.find(a => a.id === angleId) || CAMERA_ANGLES[0];
      const enhancedPrompt = `${prompt}, ${angle.suffix}`;

      const response = await fetch(`${API_BASE}/v1/image_generation`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "image-01",
          prompt: enhancedPrompt,
          aspect_ratio,
          response_format: "base64",
          n: 1,
          prompt_optimizer: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.base_resp && data.base_resp.status_code !== 0) {
        throw new Error(data.base_resp.status_msg || "Image generation failed");
      }

      if (!data.data || !data.data.image_base64 || !Array.isArray(data.data.image_base64) || data.data.image_base64.length === 0) {
        throw new Error("No image data returned");
      }

      return {
        angleId,
        angleName: angle.name,
        image_base64: data.data.image_base64[0],
      };
    });

    const images = await Promise.all(imagePromises);

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("[MiniMax Image API Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
