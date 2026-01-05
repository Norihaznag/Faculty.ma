import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseReady = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.length > 0 && supabaseAnonKey.length > 0);
};

// Create client only if configured, otherwise create a dummy client
let supabaseClient: any = null;

const initializeSupabase = () => {
  if (isSupabaseReady()) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
      console.warn('Failed to initialize Supabase:', error);
      supabaseClient = createDummyClient();
    }
  } else {
    supabaseClient = createDummyClient();
  }
  return supabaseClient;
};

// Dummy client for when Supabase is not available
const createDummyClient = () => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: null, error: null }) }) }) }),
      insert: () => Promise.reject(new Error('Supabase not configured')),
    }),
  };
};

export const supabase = initializeSupabase();
