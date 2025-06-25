import type { H3Event } from "h3";
import type { PaymentHistory } from "@/modules/billing/types/payment.type";
import Stripe from "stripe";
import { getProductById } from "@/modules/billing/utils";
import { serverSupabaseServiceRole } from "#supabase/server";
import type { Database } from "@/modules/shared/types/database.types";
import aiConfig from "@/config/ai";
import { addSubscriptionToken, addOnetimeToken } from "@/server/utils/ai-tools";
import { DB_TABLES } from "@/config/db/tables";

// Get subscription payment
export async function getPaymentBySubscriptionId(
  subscriptionId: string,
  event: H3Event
) {
  const client = await serverSupabaseServiceRole<Database>(event);
  const { data: payment } = await client
    .from(DB_TABLES.PAYMENT_HISTORY)
    .select()
    .eq("out_trade_no", subscriptionId)
    .single();

  return payment;
}

// Handle tokens
export async function handleTokens(
  payment: PaymentHistory,
  event: H3Event,
  sessionOrInvoice: Stripe.Checkout.Session | Stripe.Invoice
) {
  const client = await serverSupabaseServiceRole<Database>(event);
  const product = getProductById(payment.product_id);

  if (!product || !aiConfig.enable || !product.token_limit) {
    return;
  }

  if (product.mode === "subscription" && product.subscription_duration) {
    const subscription = await getPaymentBySubscriptionId(
      sessionOrInvoice.subscription as string,
      event
    );

    if (subscription) {
      const { data: existingToken } = await client
        .from(DB_TABLES.USER_SUBSCRIPTION_TOKEN)
        .select()
        .eq("subscription_id", subscription.id)
        .single();

      if (!existingToken) {
        await addSubscriptionToken({
          event,
          subscriptionId: subscription.id,
          totalTokens: product.token_limit,
          uid: payment.uid,
        });
      }
    }
  } else if (product.mode === "one_time") {
    await addOnetimeToken({
      event,
      paymentId: payment.id as number,
      totalTokens: product.token_limit,
      uid: payment.uid,
    });
  }
}
