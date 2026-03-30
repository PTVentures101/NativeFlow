import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const client = await clerkClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.clerkUserId;
        const subscriptionId = session.subscription as string;

        if (userId) {
          const user = await client.users.getUser(userId);
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              ...user.publicMetadata,
              tier: "pro",
              stripeSubscriptionId: subscriptionId,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;

        if (userId) {
          const user = await client.users.getUser(userId);
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              ...user.publicMetadata,
              tier: "free",
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;

        if (userId) {
          const isActive =
            subscription.status === "active" || subscription.status === "trialing";
          const user = await client.users.getUser(userId);
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              ...user.publicMetadata,
              tier: isActive ? "pro" : "free",
            },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
