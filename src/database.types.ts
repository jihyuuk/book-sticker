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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      account_setting: {
        Row: {
          created_at: string
          daily_book_limit: number
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_book_limit?: number
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_book_limit?: number
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      book: {
        Row: {
          author: string | null
          cover_path: string | null
          cover_url: string | null
          created_at: string
          id: string
          isbn: string | null
          post_id: string
          publisher: string | null
          title: string
        }
        Insert: {
          author?: string | null
          cover_path?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          post_id: string
          publisher?: string | null
          title: string
        }
        Update: {
          author?: string | null
          cover_path?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          post_id?: string
          publisher?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          name: string | null
          public_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean
          name?: string | null
          public_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          name?: string | null
          public_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kid: {
        Row: {
          book_count: number
          classroom_id: string
          created_at: string
          id: string
          name: string
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          book_count?: number
          classroom_id: string
          created_at?: string
          id?: string
          name: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          book_count?: number
          classroom_id?: string
          created_at?: string
          id?: string
          name?: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kid_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classroom"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          classroom_id: string
          content: string | null
          created_at: string
          id: string
          kid_id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          classroom_id: string
          content?: string | null
          created_at?: string
          id?: string
          kid_id: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          classroom_id?: string
          content?: string | null
          created_at?: string
          id?: string
          kid_id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kid"
            referencedColumns: ["id"]
          },
        ]
      }
      post_image: {
        Row: {
          created_at: string
          id: string
          post_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_image_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_cleanup_queue: {
        Row: {
          bucket: string
          claim_token: string | null
          created_at: string
          id: number
          last_error: string | null
          locked_until: string | null
          next_attempt_at: string
          retry_count: number
          storage_path: string
        }
        Insert: {
          bucket: string
          claim_token?: string | null
          created_at?: string
          id?: never
          last_error?: string | null
          locked_until?: string | null
          next_attempt_at?: string
          retry_count?: number
          storage_path: string
        }
        Update: {
          bucket?: string
          claim_token?: string | null
          created_at?: string
          id?: never
          last_error?: string | null
          locked_until?: string | null
          next_attempt_at?: string
          retry_count?: number
          storage_path?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_storage_cleanup_jobs: {
        Args: { p_limit?: number }
        Returns: {
          bucket: string
          claim_token: string | null
          created_at: string
          id: number
          last_error: string | null
          locked_until: string | null
          next_attempt_at: string
          retry_count: number
          storage_path: string
        }[]
        SetofOptions: {
          from: "*"
          to: "storage_cleanup_queue"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_post: {
        Args: {
          p_author: string
          p_content: string
          p_cover_url: string
          p_isbn: string
          p_kid_id: string
          p_password_hash: string
          p_public_id: string
          p_publisher: string
          p_title: string
        }
        Returns: string
      }
      create_post_v2: {
        Args: {
          p_author: string
          p_content: string
          p_cover_path: string
          p_cover_url: string
          p_images: Json
          p_isbn: string
          p_kid_id: string
          p_password_hash: string
          p_post_id: string
          p_public_id: string
          p_publisher: string
          p_title: string
        }
        Returns: string
      }
      finish_storage_cleanup_jobs: {
        Args: { p_claim_token: string; p_error?: string; p_ids: number[] }
        Returns: number
      }
      get_public_chart: { Args: { p_public_id: string }; Returns: Json }
      get_public_chart_data: { Args: { p_public_id: string }; Returns: Json }
      get_public_classroom: { Args: { p_public_id: string }; Returns: Json }
      get_public_kids: { Args: { p_public_id: string }; Returns: Json }
      get_public_post_create_data: {
        Args: { p_public_id: string }
        Returns: Json
      }
      get_public_posts: { Args: { p_public_id: string }; Returns: Json }
      update_post: {
        Args: { p_content: string; p_post_id: string }
        Returns: string
      }
      update_post_v2: {
        Args: { p_content: string; p_images: Json; p_post_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
