import { NextRequest, NextResponse } from "next/server";
import {
  getObjectComponents,
  generatePromptFromComponents,
  ComponentResult,
} from "@/lib/knowledge-graph";

/**
 * 物件分析 API
 * 使用三層索引系統分析物件組成
 * GET /api/analyze-object?object=智慧手機&count=6&style=realistic&aspectRatio=16:9
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const objectName = searchParams.get("object");
    const count = parseInt(searchParams.get("count") || "6");
    const style = (searchParams.get("style") || "diagram") as "realistic" | "diagram" | "technical";
    const aspectRatio = searchParams.get("aspectRatio") || "16:9";

    if (!objectName) {
      return NextResponse.json(
        { success: false, error: "缺少物件名稱" },
        { status: 400 }
      );
    }

    console.log(`[AnalyzeObject] 分析物件: ${objectName}`);

    // 使用知識圖譜分析
    const result: ComponentResult = await getObjectComponents(objectName, count);

    // 確保只返回指定數量的組件
    const limitedComponents = result.components.slice(0, count);

    // 生成提示詞
    const prompt = generatePromptFromComponents(result.objectName, limitedComponents, style, aspectRatio);

    console.log(`[AnalyzeObject] 分析完成: ${result.objectName} (${result.source}, ${limitedComponents.length} 個組件)`);

    return NextResponse.json({
      success: true,
      data: {
        objectName: result.objectName,
        components: limitedComponents.map((c, i) => ({
          id: i + 1,
          name: c.name,
          description: c.description,
          layer: c.layer,
          subcomponents: c.subcomponents,
        })),
        prompt,
        style,
        aspectRatio,
        source: result.source,
        confidence: result.confidence,
        explanation: result.explanation,
      },
    });
  } catch (error) {
    console.error("[AnalyzeObject] 分析錯誤:", error);
    return NextResponse.json(
      { success: false, error: "分析過程發生錯誤" },
      { status: 500 }
    );
  }
}
