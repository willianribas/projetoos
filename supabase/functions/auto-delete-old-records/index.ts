
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the current date
    const now = new Date();
    
    // Get date 3 days ago
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    
    // Format date for Postgres
    const formattedDate = threeDaysAgo.toISOString();
    
    console.log(`Deleting service orders deleted before: ${formattedDate}`);
    
    // Delete service orders that were soft-deleted more than 3 days ago
    const { data, error } = await supabase
      .from("service_orders")
      .delete()
      .lt("deleted_at", formattedDate)
      .not("deleted_at", "is", null);
    
    if (error) {
      console.error("Error deleting old records:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    console.log("Successfully deleted old records:", data?.length || 0);
    
    return new Response(
      JSON.stringify({ 
        message: "Auto-deletion completed successfully",
        deletedRecords: data?.length || 0
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
