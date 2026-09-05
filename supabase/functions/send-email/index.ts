const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, message } = await req.json();

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },

        body: JSON.stringify({
          from: "BMI Event <onboarding@resend.dev>",

          to: ["product@jeevijay.com"],

          subject: "New Website Enquiry",

          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0b09; color: #f7f2e8; border: 1px solid rgba(247,242,232,0.10); border-radius: 8px; overflow: hidden;">
              <div style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(247,242,232,0.10);">
                <h1 style="margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 2px; color: #c6a462; font-family: 'Georgia', serif;">BMI EVENT</h1>
                <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 4px; color: #a49a84; text-transform: uppercase;">New Registration Received</p>
              </div>
              <div style="padding: 40px;">
                <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                  A new application has been submitted on the website. Here are the details provided by the attendee:
                </p>
                <div style="background-color: #14120f; padding: 24px; border-radius: 4px; border: 1px solid rgba(247,242,232,0.05);">
                  <p style="margin: 0 0 16px 0; font-size: 15px;">
                    <strong style="color: #c6a462; display: inline-block; width: 100px;">Name:</strong> ${name}
                  </p>
                  <p style="margin: 0 0 16px 0; font-size: 15px;">
                    <strong style="color: #c6a462; display: inline-block; width: 100px;">Email:</strong> <a href="mailto:${email}" style="color: #f7f2e8; text-decoration: none;">${email}</a>
                  </p>
                  <p style="margin: 0; font-size: 15px;">
                    <strong style="color: #c6a462; display: inline-block; width: 100px;">Details:</strong> ${message}
                  </p>
                </div>
                <p style="font-size: 14px; color: #857b67; margin-top: 40px; text-align: center;">
                  Please login to the Admin Dashboard to review and approve this registration.
                </p>
              </div>
              <div style="background-color: #14120f; padding: 20px; text-align: center; border-top: 1px solid rgba(247,242,232,0.10);">
                <p style="margin: 0; font-size: 11px; color: #857b67; letter-spacing: 1px;">
                  © 2026 BMI EVENTS. ALL RIGHTS RESERVED.
                </p>
              </div>
            </div>
          `,
        }),
      }
    );

    const data = await resendResponse.json();

    return new Response(
      JSON.stringify(data),
      {
        status: resendResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
