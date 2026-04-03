import { NextRequest, NextResponse } from "next/server";
import { loadExplosionGallery, loadExplosionIndex } from "@/lib/explosion-store";

/**
 * 爆炸圖圖庫 API
 * 用於取得自動生成的爆炸圖
 */

// GET /api/explosion-gallery - 取得圖庫
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const gallery = loadExplosionGallery();
    const index = loadExplosionIndex();

    const paginatedGallery = gallery.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedGallery,
      total: gallery.length,
      index: {
        totalGenerated: index.totalGenerated,
        lastCronRun: index.lastCronRun,
        cronEnabled: index.cronEnabled,
        pendingObjects: index.generatedObjects.length,
      },
    });
  } catch (error) {
    console.error("[ExplosionGallery API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}
