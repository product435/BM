import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as crypto from "node:crypto";

export default {
  async fetch(req: Request) {
    try {
      const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured");
      }

      const signature = req.headers.get('x-razorpay-signature');
      if (!signature) {
        throw new Error("Missing x-razorpay-signature header");
      }

      // We must use the raw request body to verify the signature
      const rawBody = await req.text();

      // Verify the webhook signature
      const expectedSignature = crypto.createHmac('sha256', webhookSecret)
                                      .update(rawBody)
                                      .digest('hex');

      if (expectedSignature !== signature) {
        console.error("Webhook signature mismatch:", { expected: expectedSignature, actual: signature });
        return new Response("Invalid signature", { status: 400 });
      }

      const payload = JSON.parse(rawBody);
      const event = payload.event;
      
      const paymentEntity = payload.payload?.payment?.entity;
      const order_id = paymentEntity?.order_id;
      const payment_id = paymentEntity?.id;

      if (!order_id) {
        // Some events might not have an order_id (unlikely for our use case, but handle safely)
        return new Response("Event received, but no order_id found", { status: 200 });
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey;
      const supabase = createClient(supabaseUrl, serviceKey);

      let newStatus = '';
      if (event === 'payment.captured' || event === 'order.paid') {
        newStatus = 'PAID';
      } else if (event === 'payment.failed') {
        newStatus = 'FAILED';
      } else if (event === 'refund.processed') {
        newStatus = 'REFUNDED';
      }

      if (newStatus) {
        const updateData: any = {
          payment_status: newStatus,
        };

        // Only update these if we actually have them (e.g. captured)
        if (newStatus === 'PAID') {
          updateData.razorpay_payment_id = payment_id;
          updateData.paid_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from('registrations')
          .update(updateData)
          .eq('razorpay_order_id', order_id);

        if (error) {
          console.error(`Failed to update DB for order ${order_id}:`, error);
          throw new Error("Database update failed");
        }
        console.log(`Successfully updated order ${order_id} to status ${newStatus}`);
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error: any) {
      console.error("Webhook Error:", error.message);
      return new Response(error.message, { status: 500 });
    }
  }
};
