import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define predefined fees for registration types
const REGISTRATION_FEES: Record<string, number> = {
  student: 0,
  visitor: 500,
  entrepreneur: 1000,
  businessTycoon: 2000,
};

export default {
  async fetch(req: Request) {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      const body = await req.json();
      const { registrationId, registrationType } = body;

      if (!registrationId || !registrationType) {
        throw new Error("Missing registrationId or registrationType");
      }

      // 1. Determine amount securely from server-side mapping
      const amount = REGISTRATION_FEES[registrationType as string];

      if (amount === undefined || amount <= 0) {
        throw new Error("Invalid registration type or fee is zero");
      }

      // 2. Get secrets from environment variables
      const key_id = Deno.env.get('RAZORPAY_KEY_ID');
      const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET');

      if (!key_id || !key_secret) {
        throw new Error("Razorpay credentials are not set in the Edge Function environment.");
      }

      // 3. Create Order via Razorpay API
      const token = btoa(`${key_id}:${key_secret}`);
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Amount is in paise (₹1 = 100 paise)
          currency: 'INR',
          receipt: registrationId, // Link receipt to our registration ID
        }),
      });

      const orderData = await razorpayResponse.json();

      if (!razorpayResponse.ok) {
        console.error("Razorpay API Error:", orderData);
        throw new Error(orderData.error?.description || "Failed to create Razorpay order");
      }

      // 4. Update the registrations table with the new order ID and payment amount
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // We use anon key. Since it's a server environment, if RLS prevents update without auth,
      // we might need SERVICE_ROLE_KEY. The user instructed to use the existing anon key for frontend so we try it first.
      // But typically we should use SERVICE_ROLE_KEY to bypass RLS in an edge function updating records securely.
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseKey;
      const supabaseAdmin = createClient(supabaseUrl, serviceKey);

      const { error: dbError } = await supabaseAdmin
        .from('registrations')
        .update({
          payment_amount: amount,
          razorpay_order_id: orderData.id,
        })
        .eq('registration_id', registrationId);

      if (dbError) {
        console.error("Supabase DB Error:", dbError);
        throw new Error("Failed to link Razorpay order to registration.");
      }

      // 5. Send the Order ID and details back to the frontend
      return new Response(JSON.stringify(orderData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (error: any) {
      console.error("Function Error:", error.message);
      return new Response(JSON.stringify({ 
        error: error.message, 
        stack: error.stack,
        details: "Verbose error log for debugging",
        rawError: String(error)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
  }
};
