import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://don-toliver-hq.vercel.app";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}?error=spotify_denied`);
  }

  return NextResponse.redirect(`${baseUrl}?spotify=connected`);
}
