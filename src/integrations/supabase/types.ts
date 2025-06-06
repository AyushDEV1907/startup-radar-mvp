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
      bandit_state: {
        Row: {
          a: Json
          b: Json
          created_at: string | null
          feature_dimension: number
          investor_id: string
          last_updated: string | null
        }
        Insert: {
          a?: Json
          b?: Json
          created_at?: string | null
          feature_dimension?: number
          investor_id: string
          last_updated?: string | null
        }
        Update: {
          a?: Json
          b?: Json
          created_at?: string | null
          feature_dimension?: number
          investor_id?: string
          last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bandit_state_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          action: string
          created_at: string
          id: string
          investor_id: string
          is_demo: boolean
          startup_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          investor_id?: string
          is_demo?: boolean
          startup_id?: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          investor_id?: string
          is_demo?: boolean
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Interactions_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Interactions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      linucb_params: {
        Row: {
          a: Json
          b: Json
          investor_id: string
          last_updated: string | null
        }
        Insert: {
          a?: Json
          b?: Json
          investor_id: string
          last_updated?: string | null
        }
        Update: {
          a?: Json
          b?: Json
          investor_id?: string
          last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linucb_params_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          created_at: string
          founder_id: string
          id: string
          industry: string
          metrics: Json | null
          name: string
          pitch_deck_url: string | null
          stage: string
        }
        Insert: {
          created_at?: string
          founder_id?: string
          id?: string
          industry: string
          metrics?: Json | null
          name: string
          pitch_deck_url?: string | null
          stage: string
        }
        Update: {
          created_at?: string
          founder_id?: string
          id?: string
          industry?: string
          metrics?: Json | null
          name?: string
          pitch_deck_url?: string | null
          stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "Startups_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          plan: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          plan?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          plan?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_horizontal_recommendations: {
        Args: { user_id_input: string }
        Returns: {
          startup_id: string
          name: string
          industry: string
          stage: string
          cf_score: number
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_vertical_recommendations: {
        Args: { user_id_input: string } | { user_id_input: string }
        Returns: {
          id: string
          name: string
          industry: string
          stage: string
          score: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "investor" | "founder"
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
      app_role: ["investor", "founder"],
    },
  },
} as const
