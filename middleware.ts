// middleware.ts (корень проекта)
export { default } from "next-auth/middleware";

// какие пути делать приватными:
export const config = {
  matcher: ["/dashboard/:path*", "/accounts/:path*", "/transactions/:path*"],
};
