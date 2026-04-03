import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.minimax.io";

export async function POST(request: NextRequest) {
  const API_KEY = process.env.MINIMAX_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "MINIMAX_API_KEY environment variable is not set" }, { status: 500 });
  }

  try {
    let body;
    let endpoint;
    let params;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      endpoint = formData.get("endpoint") as string;
      const entries: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        if (key !== "endpoint") {
          entries[key] = value;
        }
      });
      params = entries;
    } else {
      body = await request.json();
      ({ endpoint, ...params } = body);
    }

    let url: string;
    let fetchOptions: RequestInit = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    if (endpoint === "t2a" || endpoint === "t2a_async_v2") {
      // TTS endpoint - use t2a_v2 for synchronous, more reliable
      url = `${API_BASE}/v1/t2a_v2`;
      fetchOptions.body = JSON.stringify({
        model: params.model || "speech-2.8-hd",
        text: params.text,
        voice_setting: params.voice_setting || {
          voice_id: params.voice_id || "male-qn-qingse",
          speed: Number(params.speed) || 1,
          vol: parseInt(params.volume) || 1,
          pitch: parseInt(params.pitch) || 0,
          emotion: params.emotion || "neutral",
        },
        audio_setting: params.audio_setting || {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3",
          channel: 1,
        },
        stream: false,
        pronunciation_dict: {
          tone: [],
        },
        subtitle_enable: false,
        output_format: "hex",
      });
    } else if (endpoint === "files/upload") {
      url = `${API_BASE}/v1/files/upload`;
      const formData = new FormData();
      if (params.file) {
        formData.append("file", params.file as File);
      }
      if (params.file_name) {
        formData.append("file_name", params.file_name as string);
      }
      if (params.purpose) {
        formData.append("purpose", params.purpose as string);
      }
      fetchOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: formData,
      };
    } else if (endpoint === "voice_clone") {
      url = `${API_BASE}/v1/voice_clone`;
      const formData = new FormData();
      Object.entries(params).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      fetchOptions = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: formData,
      };
    } else {
      return NextResponse.json({ error: `Unknown endpoint: ${endpoint}` }, { status: 400 });
    }

    console.log(`[MiniMax Speech API] URL: ${url}`);
    console.log(`[MiniMax Speech API] Body:`, fetchOptions.body);

    const response = await fetch(url, fetchOptions);

    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MiniMax Speech API Error] ${response.status}:`, errorText);
      return NextResponse.json({
        error: `API Error ${response.status}: ${errorText}`
      }, { status: response.status });
    }

    const data = await response.json();
    console.log("[MiniMax Speech API] Response:", data);

    // Check for business errors
    if (data.base_resp && data.base_resp.status_code !== 0) {
      console.error("[MiniMax Speech API Error]:", data.base_resp);
      return NextResponse.json({
        error: data.base_resp.status_msg || "Speech synthesis failed"
      }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[MiniMax API Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const API_KEY = process.env.MINIMAX_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "MINIMAX_API_KEY environment variable is not set" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const task_id = searchParams.get("task_id");
    const file_id = searchParams.get("file_id");

    let url: string;

    // Query TTS task status
    if (action === "query_tts" && task_id) {
      url = `${API_BASE}/v1/query/t2a_async_query_v2?task_id=${task_id}`;
    }
    // Get voice list - return default voices since API endpoint differs by region
    else if (action === "voices") {
      // Default system voices available on Global platform
      const defaultVoices = [
        { voice_id: "male-qn-qingse", name: "Male Qingse", language: "Chinese" },
        { voice_id: "female-shaonv", name: "Female Shaonv", language: "Chinese" },
        { voice_id: "audiobook_male_1", name: "Audiobook Male", language: "Chinese" },
        { voice_id: "female-tianmei", name: "Female Tianmei", language: "Chinese" },
        { voice_id: "male-yuanjiang", name: "Male Yuanjiang", language: "Chinese" },
      ];
      return NextResponse.json({ voices: defaultVoices });
    }
    // Retrieve file content (audio download)
    else if (action === "get_file" && file_id) {
      url = `${API_BASE}/v1/files/retrieve_content?file_id=${file_id}`;
    } else {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log(`[MiniMax Speech API GET] URL: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
      },
    });

    // For file retrieval, we need to handle binary response
    if (action === "get_file") {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "audio/mp3",
          "Content-Disposition": `attachment; filename="tts_${file_id}.mp3"`,
        },
      });
    }

    const data = await response.json();
    console.log("[MiniMax Speech API GET] Response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[MiniMax API Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
