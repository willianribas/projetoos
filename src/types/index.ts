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
  deadline?: string;
}

export interface Comment {
  id: number;
  service_order_id: number;
  user_id: string;
  content: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CommentNotification {
  id: number;
  comment_id: number;
  user_id: string;
  is_read: boolean;
  created_at: string;
}