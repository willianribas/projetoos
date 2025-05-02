
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ServiceOrder } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

interface ServiceOrderContextType {
  serviceOrders: ServiceOrder[];
  setServiceOrders: React.Dispatch<React.SetStateAction<ServiceOrder[]>>;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addServiceOrder: (order: ServiceOrder) => Promise<void>;
  updateServiceOrder: (order: ServiceOrder) => Promise<void>;
  deleteServiceOrder: (id: number) => Promise<void>;
  softDeleteServiceOrder: (id: number) => Promise<void>;
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined);

export const useServiceOrders = () => {
  const context = useContext(ServiceOrderContext);
  if (!context) {
    throw new Error("useServiceOrders must be used within a ServiceOrderProvider");
  }
  return context;
};

export const ServiceOrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchServiceOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) {
        console.warn("User not available, skipping fetch.");
        return;
      }

      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(new Error(error.message));
      } else {
        // Ensure priority is always 'normal' or 'critical'
        const typeSafeData = data?.map(item => ({
          ...item,
          priority: (item.priority === 'critical' ? 'critical' : 'normal') as 'normal' | 'critical'
        })) || [];
        
        setServiceOrders(typeSafeData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchServiceOrders();
    }
  }, [user, fetchServiceOrders]);

  const refetch = async () => {
    await fetchServiceOrders();
  };

  const addServiceOrder = async (order: ServiceOrder) => {
    try {
      const { data, error } = await supabase
        .from('service_orders')
        .insert([{ ...order, user_id: user?.id }])
        .select()
        .single();

      if (error) {
        console.error("Error adding service order:", error);
        throw error;
      }

      // Ensure priority is 'normal' or 'critical'
      const typeSafeOrder = {
        ...data,
        priority: (data.priority === 'critical' ? 'critical' : 'normal') as 'normal' | 'critical'
      };

      setServiceOrders(prevOrders => [typeSafeOrder, ...prevOrders]);
    } catch (err) {
      console.error("Failed to add service order:", err);
      throw err;
    }
  };

  const updateServiceOrder = async (order: ServiceOrder) => {
    try {
      const { data, error } = await supabase
        .from('service_orders')
        .update(order)
        .eq('id', order.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating service order:", error);
        throw error;
      }

      // Ensure priority is 'normal' or 'critical'
      const typeSafeOrder = {
        ...data,
        priority: (data.priority === 'critical' ? 'critical' : 'normal') as 'normal' | 'critical'
      };

      setServiceOrders(prevOrders =>
        prevOrders.map(o => (o.id === order.id ? typeSafeOrder : o))
      );
    } catch (err) {
      console.error("Failed to update service order:", err);
      throw err;
    }
  };

  const deleteServiceOrder = async (id: number) => {
    try {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting service order:", error);
        throw error;
      }

      setServiceOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (err) {
      console.error("Failed to delete service order:", err);
      throw err;
    }
  };

  const softDeleteServiceOrder = async (id: number) => {
    try {
      const { error } = await supabase
        .from('service_orders')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error("Error soft deleting service order:", error);
        throw error;
      }

      setServiceOrders(prevOrders =>
        prevOrders.map(order => (order.id === id ? { ...order, deleted_at: new Date().toISOString() } : order))
      );
    } catch (err) {
      console.error("Failed to soft delete service order:", err);
      throw err;
    }
  };

  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        setServiceOrders,
        loading,
        error,
        refetch,
        addServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
        softDeleteServiceOrder,
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

export { ServiceOrderContext };
