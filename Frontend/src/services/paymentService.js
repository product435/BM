import { supabase } from '../lib/supabase.js';

export const createRazorpayOrder = async (registrationId, registrationType) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { registrationId, registrationType }
    });

    if (error) {
      console.error("Edge function error context:", error.context || error);
      if (error.context && error.context.json) {
        const errJson = await error.context.json().catch(() => null);
        console.error("Parsed edge function error:", errJson);
        throw new Error(errJson?.error || error.message);
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

export const verifyRazorpayPayment = async (registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    throw error;
  }
};
