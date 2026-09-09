import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as crypto from "node:crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      const body = await req.json();
      const { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

      if (!registrationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error("Missing required fields for payment verification");
      }

      const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');
      if (!key_secret) {
        throw new Error("RAZORPAY_KEY_SECRET is not set.");
      }

      // 1. Verify Razorpay Signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto.createHmac('sha256', key_secret)
                                      .update(text)
                                      .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        console.error("Signature mismatch:", { expectedSignature, actual: razorpay_signature });
        throw new Error("Payment signature verification failed. This might be a tampered request.");
      }

      // 2. Update the Supabase Database
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
      // We use the service role key to securely update the database without RLS if needed
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey;
      
      const supabase = createClient(supabaseUrl, serviceKey);

      const { error: dbError } = await supabase
        .from('registrations')
        .update({
          payment_status: 'PAID',
          razorpay_payment_id,
          razorpay_signature,
          paid_at: new Date().toISOString(),
        })
        .eq('registration_id', registrationId)
        .eq('razorpay_order_id', razorpay_order_id); // ensure it's the right order

      if (dbError) {
        console.error("DB Update Error:", dbError);
        throw new Error("Failed to update registration payment status");
      }

      return new Response(JSON.stringify({ ok: true, message: "Payment verified successfully" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (error: any) {
      console.error("Verification Error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
  }
};
