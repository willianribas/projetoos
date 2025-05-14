
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceOrder } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface SharedServiceOrder {
  id: string;
  service_order_id: number;
  shared_by: string;
  shared_with: string;
  shared_at: string;
  is_accepted: boolean;
  message?: string;
  sharer_name?: string;
  order?: ServiceOrder;
}

export function useSharedServiceOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Buscar ordens de serviço compartilhadas com o usuário
  const { data: sharedOrders = [], isLoading } = useQuery({
    queryKey: ['shared_service_orders', user?.id],
    queryFn: async () => {
      // Buscar os registros de compartilhamento
      const { data: shares, error: sharesError } = await supabase
        .from('shared_service_orders')
        .select('*')
        .eq('shared_with', user?.id)
        .order('shared_at', { ascending: false });

      if (sharesError) {
        console.error('Error fetching shared service orders:', sharesError);
        throw sharesError;
      }

      if (!shares.length) return [];

      // Buscar detalhes completos das OS compartilhadas
      const serviceOrderIds = shares.map(share => share.service_order_id);
      
      const { data: orders, error: ordersError } = await supabase
        .from('service_orders')
        .select('*')
        .in('id', serviceOrderIds);

      if (ordersError) {
        console.error('Error fetching service orders details:', ordersError);
        throw ordersError;
      }

      // Buscar nomes dos usuários que compartilharam
      const sharerIds = shares.map(share => share.shared_by);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', sharerIds);

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }

      // Combinar os dados
      return shares.map(share => {
        const order = orders?.find(o => o.id === share.service_order_id);
        const profile = profiles?.find(p => p.id === share.shared_by);
        
        return {
          ...share,
          sharer_name: profile?.full_name || 'Usuário desconhecido',
          order: order || undefined
        };
      });
    },
    enabled: !!user,
  });

  // Aceitar uma ordem de serviço compartilhada
  const acceptMutation = useMutation({
    mutationFn: async (shareId: string) => {
      const { data, error } = await supabase
        .from('shared_service_orders')
        .update({ is_accepted: true })
        .eq('id', shareId)
        .eq('shared_with', user?.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared_service_orders', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['service_orders', user?.id] });
      toast({
        title: "Ordem de serviço aceita",
        description: "A ordem de serviço compartilhada foi aceita com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao aceitar ordem de serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Recusar uma ordem de serviço compartilhada
  const declineMutation = useMutation({
    mutationFn: async (shareId: string) => {
      const { data, error } = await supabase
        .from('shared_service_orders')
        .delete()
        .eq('id', shareId)
        .eq('shared_with', user?.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared_service_orders', user?.id] });
      toast({
        title: "Compartilhamento recusado",
        description: "O compartilhamento foi recusado com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao recusar compartilhamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle para expandir/colapsar detalhes da OS
  const toggleExpand = (shareId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shareId)) {
        newSet.delete(shareId);
      } else {
        newSet.add(shareId);
      }
      return newSet;
    });
  };

  const isExpanded = (shareId: string) => {
    return expandedOrders.has(shareId);
  };

  return {
    sharedOrders,
    isLoading,
    acceptOrder: (shareId: string) => acceptMutation.mutate(shareId),
    declineOrder: (shareId: string) => declineMutation.mutate(shareId),
    toggleExpand,
    isExpanded,
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending
  };
}
