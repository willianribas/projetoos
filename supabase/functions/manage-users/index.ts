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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { action, userId, newPassword, email, password, fullName } = await req.json()

    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: { user: requestUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
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

        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const userExists = existingUsers.users.some(u => u.email === email)
        
        if (userExists) {
          return new Response(
            JSON.stringify({ error: 'Um usuário com este email já está registrado' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName },
        })
        
        if (createError) {
          console.error('Error creating user:', createError)
          return new Response(
            JSON.stringify({ error: createError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
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
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { password: newPassword }
        )
        if (updateError) {
          console.error('Error updating password:', updateError)
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

        try {
          const { error: deleteServiceOrdersError } = await supabaseAdmin
            .from('service_orders')
            .delete()
            .eq('user_id', userId)

          if (deleteServiceOrdersError) {
            console.error('Error deleting service orders:', deleteServiceOrdersError)
            throw new Error('Erro ao deletar ordens de serviço do usuário')
          }

          const { error: deleteRoleError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', userId)

          if (deleteRoleError) {
            console.error('Error deleting user role:', deleteRoleError)
            throw new Error('Erro ao deletar permissões do usuário')
          }

          const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)
          
          if (deleteUserError) {
            console.error('Error deleting user:', deleteUserError)
            throw new Error(deleteUserError.message)
          }

          result = { success: true }
        } catch (error) {
          console.error('Delete operation failed:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        break

      case 'list':
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        if (listError) {
          console.error('Error listing users:', listError)
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