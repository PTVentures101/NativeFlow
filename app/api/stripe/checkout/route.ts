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

  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });
  }

  // Get or create Stripe customer
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  let customerId = user.publicMetadata?.stripeCustomerId as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
      metadata: { clerkUserId: userId },
    });
    customerId = customer.id;
    // Store customerId in Clerk metadata so we can look it up later
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { ...user.publicMetadata, stripeCustomerId: customerId },
    });
  }

  const origin = request.headers.get("origin") ?? "https://nativeflow.app";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/account?upgraded=true`,
    cancel_url: `${origin}/pricing`,
    metadata: { clerkUserId: userId },
    subscription_data: {
      metadata: { clerkUserId: userId },
    },
  });

  return NextResponse.json({ url: session.url });
}
