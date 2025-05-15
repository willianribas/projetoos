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
      analyzers: {
        Row: {
          brand: string
          calibration_due_date: string
          created_at: string
          id: string
          in_calibration: boolean
          model: string
          name: string
          serial_number: string
          user_id: string
        }
        Insert: {
          brand?: string
          calibration_due_date: string
          created_at?: string
          id?: string
          in_calibration?: boolean
          model: string
          name: string
          serial_number: string
          user_id: string
        }
        Update: {
          brand?: string
          calibration_due_date?: string
          created_at?: string
          id?: string
          in_calibration?: boolean
          model?: string
          name?: string
          serial_number?: string
          user_id?: string
        }
        Relationships: []
      }
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
      reminders: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean
          title?: string
          updated_at?: string
          user_id?: string
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
      shared_service_orders: {
        Row: {
          id: string
          is_accepted: boolean | null
          message: string | null
          service_order_id: number
          shared_at: string
          shared_by: string
          shared_with: string
        }
        Insert: {
          id?: string
          is_accepted?: boolean | null
          message?: string | null
          service_order_id: number
          shared_at?: string
          shared_by: string
          shared_with: string
        }
        Update: {
          id?: string
          is_accepted?: boolean | null
          message?: string | null
          service_order_id?: number
          shared_at?: string
          shared_by?: string
          shared_with?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_service_orders_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "deleted_service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_service_orders_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
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
      create_notification_for_recipient: {
        Args: { recipient_id: string; so_id: number; notification_type: string }
        Returns: undefined
      }
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
