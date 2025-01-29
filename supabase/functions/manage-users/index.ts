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

    const { action, email, password } = await req.json()

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
    
    console.log('Request user:', requestUser)
    
    if (authError || requestUser?.email !== 'williann.dev@gmail.com') {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    let result = {}
    switch (action) {
      case 'list':
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) {
          console.error('List users error:', listError)
          throw listError
        }
        result = { users: users || [] }
        break
      
      case 'create':
        if (!email || !password) {
          throw new Error('Email e senha são obrigatórios')
        }
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })
        
        if (createError) {
          console.error('Create user error:', createError)
          throw createError
        }
        
        if (userData.user) {
          const { error: roleError } = await supabase.from('user_roles').insert({
            user_id: userData.user.id,
            role: 'user'
          })
          
          if (roleError) {
            console.error('Create role error:', roleError)
            throw roleError
          }
        }
        
        result = { user: userData.user }
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