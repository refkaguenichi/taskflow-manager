// types/supabase.d.ts
import type { User as SupabaseUser } from '@supabase/auth-js';

export type UserWithMetadata = SupabaseUser & {
  user_metadata: {
    full_name?: string;
    email_notifications?: boolean;
    push_notifications?: boolean;
    [key: string]: any;
  };
};
