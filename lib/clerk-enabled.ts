/**
 * Server-side: true only when real Clerk keys are present.
 * Prevents auth() from being called when Clerk isn't configured,
 * which would throw "can't detect usage of clerkMiddleware()".
 */
const key = process.env.CLERK_SECRET_KEY ?? "";
export const clerkEnabled = key.startsWith("sk_") && key.length > 20 && !key.includes("replace");
