import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  type: "contact" | "registration";
  targetExam?: string;
  program?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    const { name, email, subject, type, targetExam, program } = data;

    let emailHtml = "";
    let emailSubject = "";

    if (type === "registration") {
      emailSubject = "Welcome to G-Dnyasa Mentorship!";
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #5d6d3f 0%, #8b7355 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .content { background: #f9f7f4; padding: 30px; border-radius: 0 0 12px 12px; }
            .highlight { background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #5d6d3f; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🪨 G-Dnyasa Geology Mentorship</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for registering for our mentorship program. We're excited to help you achieve your geology exam goals!</p>
              
              <div class="highlight">
                <strong>Your Registration Details:</strong><br>
                Target Exam: ${targetExam}<br>
                Preferred Program: ${program}
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your registration within 24 hours</li>
                <li>You'll receive a confirmation call to discuss your preparation goals</li>
                <li>We'll help you get started with your personalized study plan</li>
              </ul>
              
              <p>If you have any questions, feel free to reach out to us.</p>
              
              <p>Best regards,<br>The G-Dnyasa Team</p>
            </div>
            <div class="footer">
              © G-Dnyasa | Geology Mentorship Platform
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      emailSubject = "Thank you for contacting G-Dnyasa!";
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Montserrat', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #5d6d3f 0%, #8b7355 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .content { background: #f9f7f4; padding: 30px; border-radius: 0 0 12px 12px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🪨 G-Dnyasa Geology Mentorship</h1>
            </div>
            <div class="content">
              <h2>Thank you for reaching out, ${name}!</h2>
              <p>We have received your message regarding: <strong>${subject}</strong></p>
              <p>Our team will review your inquiry and get back to you within 24 hours.</p>
              <p>Best regards,<br>The G-Dnyasa Team</p>
            </div>
            <div class="footer">
              © G-Dnyasa | Geology Mentorship Platform
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "G-Dnyasa <onboarding@resend.dev>",
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
