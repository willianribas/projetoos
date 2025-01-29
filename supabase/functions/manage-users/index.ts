import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, newPassword, email, password } = await req.json()

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
      case 'create':
        if (!email || !password) {
          return new Response(
            JSON.stringify({ error: 'Email e senha são obrigatórios' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // Verificar se o usuário já existe
        const { data: existingUser } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('user_id', (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id)
          .single()

        if (existingUser) {
          return new Response(
            JSON.stringify({ error: 'Um usuário com este email já está registrado' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })
        
        if (createError) {
          return new Response(
            JSON.stringify({ error: createError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        if (userData.user) {
          const { error: roleError } = await supabase.from('user_roles').insert({
            user_id: userData.user.id,
            role: 'user'
          })
          
          if (roleError) {
            // Se houver erro ao criar a role, deletar o usuário criado
            await supabase.auth.admin.deleteUser(userData.user.id)
            return new Response(
              JSON.stringify({ error: 'Erro ao criar permissões do usuário' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }
        }
        
        result = { user: userData.user }
        break

      case 'update-password':
        if (!userId || !newPassword) {
          return new Response(
            JSON.stringify({ error: 'ID do usuário e nova senha são obrigatórios' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          userId,
          { password: newPassword }
        )
        if (updateError) {
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        result = { user: updateData.user }
        break

      case 'delete':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'ID do usuário é obrigatório' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // Primeiro, deletar o registro na tabela user_roles
        const { error: deleteRoleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)

        if (deleteRoleError) {
          console.error('Error deleting user role:', deleteRoleError)
          return new Response(
            JSON.stringify({ error: 'Erro ao deletar permissões do usuário' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        // Depois, deletar o usuário
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        
        if (deleteError) {
          console.error('Error deleting user:', deleteError)
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        result = { success: true }
        break

      case 'list':
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) {
          return new Response(
            JSON.stringify({ error: listError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        result = { users }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Ação inválida' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
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