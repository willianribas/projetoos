import React, { createContext, useContext } from "react";
import { ServiceOrder } from "@/types";
import { useServiceOrdersQuery } from "@/hooks/queries/useServiceOrders";
import { useCreateServiceOrder } from "@/hooks/mutations/useCreateServiceOrder";
import { useUpdateServiceOrder } from "@/hooks/mutations/useUpdateServiceOrder";
import { useDeleteServiceOrder } from "@/hooks/mutations/useDeleteServiceOrder";

interface ServiceOrderContextType {
  serviceOrders: ServiceOrder[];
  isLoading: boolean;
  createServiceOrder: (data: Omit<ServiceOrder, "id" | "created_at">) => void;
  updateServiceOrder: (id: number, data: ServiceOrder) => void;
  deleteServiceOrder: (id: number) => void;
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined);

export const ServiceOrderProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: serviceOrders = [], isLoading } = useServiceOrdersQuery();
  const createMutation = useCreateServiceOrder();
  const updateMutation = useUpdateServiceOrder();
  const deleteMutation = useDeleteServiceOrder();

  const createServiceOrder = (data: Omit<ServiceOrder, "id" | "created_at">) => {
    createMutation.mutate(data);
  };

  const updateServiceOrder = (id: number, data: ServiceOrder) => {
    updateMutation.mutate(data);
  };

  const deleteServiceOrder = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        isLoading,
        createServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

export const useServiceOrders = () => {
  const context = useContext(ServiceOrderContext);
  if (context === undefined) {
    throw new Error("useServiceOrders must be used within a ServiceOrderProvider");
  }
  return context;
};