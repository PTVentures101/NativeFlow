import { NextRequest, NextResponse } from "next/server";

const _key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkEnabled = _key.startsWith("pk_") && _key.length > 40;

// Lazily load Clerk middleware only when properly configured
const handler = clerkEnabled
  ? (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server");
      const isProtectedRoute = createRouteMatcher(["/account(.*)"]);
      return clerkMiddleware(async (auth: { protect: () => Promise<void> }, req: NextRequest) => {
        if (isProtectedRoute(req)) {
          await auth.protect();
        }
      });
    })()
  : (_req: NextRequest) => NextResponse.next();

export default handler;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
