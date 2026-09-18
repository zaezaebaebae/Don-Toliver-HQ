import { NotificationMode } from "@prisma/client";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const payload = z.object({ mode: z.nativeEnum(NotificationMode) });
export async function PATCH(request: NextRequest) { const userId = await getSessionUserId(); if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const { mode } = payload.parse(await request.json()); await prisma.user.update({ where: { id: userId }, data: { notificationMode: mode } }); return NextResponse.json({ mode }); }
