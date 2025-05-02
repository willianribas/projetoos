
export interface ServiceOrder {
  id: number;
  numeroos: string;
  patrimonio: string;
  equipamento: string;
  status: string;
  observacao: string | null;
  created_at: string;
  user_id?: string;
  priority?: 'normal' | 'critical';
  deleted_at?: string | null;
  status_array?: string[];
  deadline?: string;
  is_deleted?: boolean;
}
