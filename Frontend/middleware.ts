import { NextRequest, NextResponse } from "next/server";

const ROUTES = {
    ADMIN: ["/dashboard", "/account", "/order", "/cosmetic", "/setting"],
    USER_PROTECTED: ["/checkout", "/profile"],
    AUTH: ["/users/login", "/users/register", "/admin/login"],
    PUBLIC: ["/", "/product", "/cart"], // Cart is public
}
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const sessionCookie = request.cookies.get("connect.sid");
    const isLoggedIn = !!sessionCookie;

    const isAdminRoute = ROUTES.ADMIN.some(route => path.startsWith(route));
    const isUserRoute = ROUTES.USER_PROTECTED.some(route => path.startsWith(route));
    const isAuthRoute = ROUTES.AUTH.some(route => path.startsWith(route));

    if((isAdminRoute || isUserRoute) && !isLoggedIn) {
        const loginUrl = isAdminRoute ? '/admin/login' : '/users/login';
        const response = NextResponse.redirect(new URL(loginUrl, request.url));

        response.headers.set("X-Middleware-Redirect", "true");
        return response;
    }

    if(isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/order/:path*",
    "/cosmetic/:path*",
    "/setting/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/users/login",
    "/users/register",
    "/admin/login",
  ],
};
