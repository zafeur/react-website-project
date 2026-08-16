import { NextResponse } from "next/server";

const TOKEN_COOKIE_NAME = "keymiyay_token";
const USER_TYPE_COOKIE_NAME = "keymiyay_user_type";
const protectedRoutes = ["/dashboard"];

const isProtectedRoute = (pathname) =>
  protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const userType = request.cookies.get(USER_TYPE_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/";
    loginUrl.searchParams.set("login", "required");
    return NextResponse.redirect(loginUrl);
  }

  if (userType && userType !== "user") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.searchParams.set("access", "denied");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
