import { clerkClient } from "@clerk/nextjs/server";

export type Tier = "free" | "pro";

/**
 * Server-side: returns the user's tier by reading Clerk public metadata.
 * Returns "free" if userId is null or metadata is not set.
 */
export async function getUserTier(userId: string | null): Promise<Tier> {
  if (!userId) return "free";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const tier = user.publicMetadata?.tier as string | undefined;
    return tier === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}
