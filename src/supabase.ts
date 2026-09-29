import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Función para sanitizar URLs y claves que pudieran contener comillas o espacios al copiarse en Netlify
const sanitizeEnv = (val: string | undefined): string => {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
};

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeEnv(rawUrl);
const supabaseAnonKey = sanitizeEnv(rawAnonKey);

let clientInstance: SupabaseClient | null = null;
let isValidConfig = false;

// Verificación segura para evitar caídas o pantalla blanca si la URL tiene formato inesperado
if (
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://')) &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'your-anon-key'
) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    isValidConfig = true;
  } catch (error) {
    console.warn("No se pudo inicializar Supabase automáticamente:", error);
    clientInstance = null;
    isValidConfig = false;
  }
}

export const isSupabaseConfigured = isValidConfig;
export const supabase = clientInstance;
