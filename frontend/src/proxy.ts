import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const temToken = request.cookies.has("gamelog_token");

  if (!temToken) {
    const destino = new URL("/login", request.url);
    destino.searchParams.set("voltar", request.nextUrl.pathname);
    return NextResponse.redirect(destino);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/biblioteca", "/amigos", "/perfil/:path*", "/admin/:path*"],
};
