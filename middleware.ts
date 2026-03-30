import { NextRequest, NextResponse } from "next/server";

const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkEnabled = key.startsWith("pk_") && key.length > 40;

export default clerkEnabled
  ? (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server");
      const isProtectedRoute = createRouteMatcher(["/account(.*)"]);
      return clerkMiddleware(async (auth: { protect: () => Promise<void> }, req: NextRequest) => {
        if (isProtectedRoute(req)) await auth.protect();
      });
    })()
  : function middleware(_req: NextRequest) {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
