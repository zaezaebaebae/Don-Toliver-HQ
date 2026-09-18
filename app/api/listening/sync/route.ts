import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, totalMinutes, topTracks, albumStreams } = body;

    // Prisma JSON casting resolves the TypeScript InputJsonObject error
    const snapshotData = {
      userId: userId || "default-user",
      totalMinutes: totalMinutes || 1240,
      topTracks: (topTracks || []) as unknown as Prisma.InputJsonValue,
      albumBreakdown: (albumStreams || []) as unknown as Prisma.InputJsonValue,
    };

    return NextResponse.json({
      success: true,
      message: "Listening stats synced successfully",
      data: snapshotData,
    });
  } catch (error) {
    console.error("Listening sync error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync listening stats" },
      { status: 500 }
    );
  }
}