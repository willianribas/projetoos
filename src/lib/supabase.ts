import { createClient } from '@supabase/supabase-js';
import { ServiceOrder } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getServiceOrders = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching service orders:', error);
    throw error;
  }
  return data;
};

export const createServiceOrder = async (serviceOrder: Omit<ServiceOrder, 'id'>) => {
  const { data, error } = await supabase
    .from('service_orders')
    .insert(serviceOrder)
    .select()
    .single();

  if (error) {
    console.error('Error creating service order:', error);
    throw error;
  }
  return data;
};

export const updateServiceOrder = async (id: number, serviceOrder: Partial<ServiceOrder>) => {
  const { data, error } = await supabase
    .from('service_orders')
    .update(serviceOrder)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service order:', error);
    throw error;
  }
  return data;
};

export const deleteServiceOrder = async (id: number) => {
  const { error } = await supabase
    .from('service_orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service order:', error);
    throw error;
  }
};