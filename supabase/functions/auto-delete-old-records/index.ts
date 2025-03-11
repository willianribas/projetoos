
// Follow this setup guide to integrate the Deno standard library
// https://github.com/denoland/deno_std/tree/main/http/server
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.0';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Calculate date 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoISO = threeDaysAgo.toISOString();

    console.log(`Deleting service orders marked as deleted before ${threeDaysAgoISO}`);

    // Permanently delete service orders that were soft deleted more than 3 days ago
    const { data, error } = await supabaseClient
      .from('service_orders')
      .delete()
      .lt('deleted_at', threeDaysAgoISO);

    if (error) {
      console.error('Error deleting old service orders:', error);
      throw error;
    }

    console.log('Successfully cleaned up old records');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully deleted old service orders',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in auto-delete function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
