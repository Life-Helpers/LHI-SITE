import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      donor_name,
      donor_email,
      package_id,
      custom_amount,
      frequency = "one_time",
      designation,
    } = body;
    const isNidake = designation === "nidake";

    // Determine donation amount in USD
    let amount = 100;
    if (custom_amount !== undefined && custom_amount !== null && custom_amount !== "") {
      const parsed = typeof custom_amount === "string" ? parseFloat(custom_amount) : Number(custom_amount);
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed;
      }
    } else if (package_id) {
      const packageAmounts: Record<string, number> = {
        gift_25: 25,
        gift_50: 50,
        gift_100: 100,
        gift_250: 250,
        gift_500: 500,
        gift_1000: 1000,
        monthly_10: 10,
        monthly_25: 25,
        monthly_50: 50,
        monthly_100: 100,
      };
      if (packageAmounts[package_id]) {
        amount = packageAmounts[package_id];
      }
    }

    if (amount < 5) {
      return NextResponse.json(
        { error: "Donation amount must be at least $5.00." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);
    const isMonthly = frequency === "monthly";

    // Detect actual request origin safely
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin = `${proto}://${host}`;

    // Attempt Stripe checkout session creation if Stripe secret key is present
    try {
      const stripe = getStripe();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: isMonthly ? "subscription" : "payment",
        customer_email: donor_email?.trim() || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: isMonthly
                  ? `Monthly Giving (${package_id || "Custom Tier"})`
                  : isNidake
                    ? "NIDAKE Dignity Kit Sponsorship"
                    : `Life Helpers Initiative Support`,
                description: isMonthly
                  ? "A monthly gift supporting Life Helpers Initiative's programmes across 11 Nigerian states."
                  : "A gift supporting Life Helpers Initiative's work with vulnerable communities across 11 Nigerian states.",
              },
              unit_amount: amountInCents,
              ...(isMonthly ? { recurring: { interval: "month" } } : {}),
            },
            quantity: 1,
          },
        ],
        metadata: {
          donor_name: donor_name?.trim() || "Anonymous",
          donor_email: donor_email?.trim() || "",
          frequency,
          package_id: package_id || "custom",
          designation: isNidake ? "nidake" : "general",
        },
        success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}&kind=${frequency}`,
        cancel_url: `${origin}/donate?cancelled=true`,
      });

      if (session.url) {
        return NextResponse.json({ checkout_url: session.url, is_stripe: true });
      }
    } catch {
      // Stripe not configured in preview sandbox, use seamless relative route
    }

    // No payment provider configured: never pretend a payment succeeded.
    return NextResponse.json(
      {
        error:
          "Online card payments aren't available yet. You can give by bank transfer (see “Bank transfer” on this page) or email us and we'll help.",
        unavailable: true,
      },
      { status: 503 },
    );
  } catch (error: unknown) {
    console.error("Donation checkout error:", error);
    return NextResponse.json(
      { error: "Could not initiate checkout. Please try again." },
      { status: 500 }
    );
  }
}
