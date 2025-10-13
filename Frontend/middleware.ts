import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  //Define protected routes
  const isAdminRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/account") ||
    path.startsWith("/order") ||
    path.startsWith("/cosmetic") ||
    path.startsWith("/setting");

  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/admin/login");

  //Get sessions cookie
  const sessionCookie = request.cookies.get("connect.sid");

  //Check if user is logged in by checking session cookie
  const isLoggedIn = !!sessionCookie;

  //Redirect logic
  if (isAdminRoute && !isLoggedIn) {
    // Redirect to admin login if trying to access admin routes without login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAuthRoute && isLoggedIn) {
    // Redirect to home if already logged in and trying to access auth pages
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes
    "/dashboard/:path*",
    "/account/:path*",
    "/order/:path*",
    "/cosmetic/:path*",
    "/setting/:path*",
    // Protected routes
    "/cart/:path*",
    // Auth routes
    "/login",
    "/register",
    "/admin/login",
  ],
};
