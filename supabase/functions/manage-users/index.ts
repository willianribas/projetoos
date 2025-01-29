import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, newPassword } = await req.json()

    // Verificar se o usuário que fez a requisição é admin
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: { user: requestUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || requestUser?.email !== 'williann.dev@gmail.com') {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    let result = {}
    switch (action) {
      case 'update-password':
        if (!userId || !newPassword) {
          throw new Error('ID do usuário e nova senha são obrigatórios')
        }
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          userId,
          { password: newPassword }
        )
        if (updateError) throw updateError
        result = { user: updateData.user }
        break

      case 'delete':
        if (!userId) {
          throw new Error('ID do usuário é obrigatório')
        }
        const { data: deleteData, error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        if (deleteError) throw deleteError
        result = { success: true }
        break

      case 'list':
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) throw listError
        result = { users }
        break

      default:
        throw new Error('Ação inválida')
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})