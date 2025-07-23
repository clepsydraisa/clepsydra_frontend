import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para os dados das tabelas
export interface WellData {
  id: number;
  data: string;
  codigo: string;
  coord_x_m: number;
  coord_y_m: number;
  altitude_m?: string | number;
  sistema_aquifero?: string;
  estado?: string;
  freguesia?: string;
  created_at: string;
}

export interface ConductivityData extends WellData {
  condutividade: number;
  condcamp20c: number;
}

export interface NitrateData extends WellData {
  nitrato: string;
}

export interface PiezometricData extends WellData {
  nivel_piezometrico: string;
  profundidade_nivel_piezometrico: string;
}

export interface PrecipitationData extends WellData {
  precipitacao_dia_mm: number;
  nome: string;
}

// Função para converter coordenadas UTM para lat/lng
export const utmToLatLng = (x: number, y: number): [number, number] => {
  // Esta é uma conversão simplificada - para produção, use uma biblioteca como proj4js
  // Assumindo que as coordenadas estão em UTM zone 29N (Portugal)
  const zone = 29;
  const northern = true;
  
  // Conversão aproximada para Portugal
  const lat = 39.5 + (y - 500000) / 1000000;
  const lng = -8.0 + (x - 500000) / 1000000;
  
  return [lat, lng];
};

// Função para buscar dados por variável
export const fetchWellData = async (
  variable: string,
  sistemaAquifero?: string
): Promise<WellData[]> => {
  let query: any;
  
  switch (variable) {
    case 'condutividade':
      query = supabase.from('condut_tejo_loc');
      break;
    case 'nitrato':
      query = supabase.from('nitrato_tejo_loc');
      break;
    case 'profundidade':
      query = supabase.from('piezo_tejo_loc');
      break;
    case 'precipitacao':
      query = supabase.from('precipitacao_tejo_loc');
      break;
    default:
      throw new Error(`Variável não suportada: ${variable}`);
  }
  
  // Aplicar filtro de sistema aquífero se especificado
  if (sistemaAquifero && sistemaAquifero !== 'todos') {
    query = query.eq('sistema_aquifero', sistemaAquifero);
  }
  
  const { data, error } = await query.select('*');
  
  if (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
  
  return data || [];
}; 