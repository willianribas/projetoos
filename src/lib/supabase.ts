import { createClient } from '@supabase/supabase-js';
import { ServiceOrder } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getServiceOrders = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createServiceOrder = async (serviceOrder: Omit<ServiceOrder, 'id'>) => {
  const { data, error } = await supabase
    .from('service_orders')
    .insert(serviceOrder)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateServiceOrder = async (id: number, serviceOrder: Partial<ServiceOrder>) => {
  const { data, error } = await supabase
    .from('service_orders')
    .update(serviceOrder)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteServiceOrder = async (id: number) => {
  const { error } = await supabase
    .from('service_orders')
    .delete()
    .eq('id', id);

  if (error) throw error;
};