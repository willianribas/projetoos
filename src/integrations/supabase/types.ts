export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comment_notifications: {
        Row: {
          comment_id: number | null
          created_at: string
          id: number
          is_read: boolean | null
          user_id: string | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          id?: number
          is_read?: boolean | null
          user_id?: string | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          id?: number
          is_read?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "service_order_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      equipments: {
        Row: {
          created_at: string
          id: number
          identificador: string | null
          marca: string | null
          modelo: string | null
          numero_serie: string | null
          tipo_equipamento: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          identificador?: string | null
          marca?: string | null
          modelo?: string | null
          numero_serie?: string | null
          tipo_equipamento: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          identificador?: string | null
          marca?: string | null
          modelo?: string | null
          numero_serie?: string | null
          tipo_equipamento?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gets_monitoring: {
        Row: {
          created_at: string
          equipment: string | null
          id: number
          os_number: string
          patrimony: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          equipment?: string | null
          id?: number
          os_number: string
          patrimony?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          equipment?: string | null
          id?: number
          os_number?: string
          patrimony?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notification_states: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          notification_type: string
          service_order_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          notification_type: string
          service_order_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          notification_type?: string
          service_order_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_states_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "deleted_service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_states_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_order_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          parent_id: number | null
          service_order_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          parent_id?: number | null
          service_order_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          parent_id?: number | null
          service_order_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "service_order_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_comments_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "deleted_service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_comments_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_deadlines: {
        Row: {
          created_at: string
          deadline: string
          id: number
          reminder_sent: boolean | null
          service_order_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          deadline: string
          id?: number
          reminder_sent?: boolean | null
          service_order_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string
          id?: number
          reminder_sent?: boolean | null
          service_order_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_deadlines_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "deleted_service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_deadlines_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_history: {
        Row: {
          action: string
          changed_at: string
          equipamento: string
          id: number
          numeroos: string
          observacao: string | null
          patrimonio: string
          priority: string | null
          service_order_id: number | null
          status: string
          status_array: string[] | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_at?: string
          equipamento: string
          id?: number
          numeroos: string
          observacao?: string | null
          patrimonio: string
          priority?: string | null
          service_order_id?: number | null
          status: string
          status_array?: string[] | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_at?: string
          equipamento?: string
          id?: number
          numeroos?: string
          observacao?: string | null
          patrimonio?: string
          priority?: string | null
          service_order_id?: number | null
          status?: string
          status_array?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_history_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "deleted_service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_history_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          created_at: string
          deadline: string | null
          deleted_at: string | null
          equipamento: string
          id: number
          numeroos: string
          observacao: string | null
          patrimonio: string
          priority: string | null
          status: string
          status_array: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          deleted_at?: string | null
          equipamento: string
          id?: number
          numeroos: string
          observacao?: string | null
          patrimonio: string
          priority?: string | null
          status: string
          status_array?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string | null
          deleted_at?: string | null
          equipamento?: string
          id?: number
          numeroos?: string
          observacao?: string | null
          patrimonio?: string
          priority?: string | null
          status?: string
          status_array?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      deleted_service_orders: {
        Row: {
          created_at: string | null
          deadline: string | null
          deleted_at: string | null
          equipamento: string | null
          id: number | null
          numeroos: string | null
          observacao: string | null
          patrimonio: string | null
          priority: string | null
          status: string | null
          status_array: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          deleted_at?: string | null
          equipamento?: string | null
          id?: number | null
          numeroos?: string | null
          observacao?: string | null
          patrimonio?: string | null
          priority?: string | null
          status?: string | null
          status_array?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          deleted_at?: string | null
          equipamento?: string | null
          id?: number | null
          numeroos?: string | null
          observacao?: string | null
          patrimonio?: string | null
          priority?: string | null
          status?: string | null
          status_array?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
