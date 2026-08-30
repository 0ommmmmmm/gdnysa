import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminBootstrapRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, password }: AdminBootstrapRequest = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the admin email from admin_config
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get configured admin email
    const { data: adminConfig, error: configError } = await supabase
      .from("admin_config")
      .select("admin_email")
      .single();

    if (configError || !adminConfig) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve admin configuration" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const configuredAdminEmail = adminConfig.admin_email.toLowerCase();

    // Verify the requested email matches the configured admin email
    if (email.toLowerCase() !== configuredAdminEmail) {
      return new Response(
        JSON.stringify({ error: "Email does not match configured admin email" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if admin user already exists
    const { data: existingUsers, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      return new Response(
        JSON.stringify({ error: "Failed to check existing users" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const existingAdmin = existingUsers.users.find(
      (user) => user.email?.toLowerCase() === configuredAdminEmail
    );

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin user already exists" }),
        { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create the admin user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: `Failed to create admin user: ${createError.message}` }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        user: {
          id: userData.user.id,
          email: userData.user.email,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in bootstrap-admin function:", error);
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
