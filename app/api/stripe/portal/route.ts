import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const customerId = user.publicMetadata?.stripeCustomerId as string | undefined;

  if (!customerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "https://nativeflow.app";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
