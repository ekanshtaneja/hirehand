export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          id: string
          page_path: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_path?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_path?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          client_email: string
          client_name: string
          created_at: string | null
          id: string
          message: string | null
          professional_id: string | null
          status: string | null
        }
        Insert: {
          client_email: string
          client_name: string
          created_at?: string | null
          id?: string
          message?: string | null
          professional_id?: string | null
          status?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string
          created_at?: string | null
          id?: string
          message?: string | null
          professional_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          created_at: string | null
          description: string | null
          email: string
          experience: string | null
          hourly_rate: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          specialty: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email: string
          experience?: string | null
          hourly_rate?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string
          experience?: string | null
          hourly_rate?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          budget: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          location: string | null
          name: string
          service: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          location?: string | null
          name: string
          service?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          location?: string | null
          name?: string
          service?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_email: string
          client_name: string
          comment: string | null
          created_at: string | null
          id: string
          professional_id: string | null
          rating: number | null
        }
        Insert: {
          client_email: string
          client_name: string
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          rating?: number | null
        }
        Update: {
          client_email?: string
          client_name?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          rating?: number | null
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
          role: Database["public"]["Enums"]["app_role"]
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
      [_ in never]: never
    }
    Functions: {
      admin_delete_all_professionals: { Args: never; Returns: number }
      admin_delete_professional: {
        Args: { professional_id: string }
        Returns: undefined
      }
      admin_get_professionals: {
        Args: never
        Returns: {
          created_at: string | null
          description: string | null
          email: string
          experience: string | null
          hourly_rate: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          specialty: string | null
          status: string | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "professionals"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_get_quote_requests: {
        Args: never
        Returns: {
          budget: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          location: string | null
          name: string
          service: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "quote_requests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
