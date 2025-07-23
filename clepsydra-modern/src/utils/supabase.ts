import { createClient } from '@supabase/supabase-js';
import proj4 from 'proj4';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

// Verificar se as variáveis de ambiente estão configuradas
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Definir o sistema de coordenadas português (igual ao visual.html)
proj4.defs(
  "ESRI:102164",
  "+proj=tmerc +lat_0=39.66666666666666 +lon_0=-8.131906111111112 +k=1 +x_0=200000 +y_0=300000 +ellps=intl +units=m +no_defs"
);

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

// Função para converter coordenadas usando proj4js (igual ao visual.html)
export const utmToLatLng = (x: number, y: number): [number, number] => {
  try {
    // Converter de ESRI:102164 (sistema português) para WGS84
    const [lon, lat] = proj4("ESRI:102164", "WGS84", [x, y]);
    return [lat, lon]; // Retornar como [lat, lng] para o Leaflet
  } catch (error) {
    console.error('Erro na conversão de coordenadas:', error);
    // Fallback para conversão aproximada se proj4js falhar
    const lat = 39.5 + (y - 500000) / 1000000;
    const lng = -8.0 + (x - 500000) / 1000000;
    return [lat, lng];
  }
};

// Função para buscar dados por variável
export const fetchWellData = async (
  variable: string,
  sistemaAquifero?: string
): Promise<WellData[]> => {
  // Se o Supabase não estiver configurado, retornar array vazio
  if (!supabase) {
    console.warn('Supabase não configurado. Configure as variáveis de ambiente REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY');
    return [];
  }

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
  
  console.log(`Query inicializada para tabela: ${variable}, tipo: ${typeof query}, métodos:`, Object.keys(query || {}));
  
  // Aplicar filtro de sistema aquífero se especificado (apenas para variáveis que têm esta coluna)
  if (sistemaAquifero && sistemaAquifero !== 'todos' && variable !== 'precipitacao') {
    // Mapear os códigos para os valores reais da base de dados (baseado nos valores reais)
    const sistemaMap: { [key: string]: string } = {
      'AL': 'T7-ALUVIÕES DO TEJO',
      'MD': 'T1-BACIA DO TEJO-SADO / MARGEM DIREITA',
      'ME': 'T3-BACIA DO TEJO-SADO / MARGEM ESQUERDA'
    };
    
    const sistemaReal = sistemaMap[sistemaAquifero];
    console.log(`Aplicando filtro sistema_aquifero: ${sistemaReal} para variável: ${variable}`);
    if (sistemaReal && query) {
      try {
        query = query.eq('sistema_aquifero', sistemaReal);
        console.log('Filtro aplicado com sucesso');
      } catch (error) {
        console.error('Erro ao aplicar filtro:', error);
      }
    }
  } else {
    console.log(`Não aplicando filtro sistema_aquifero. sistemaAquifero: ${sistemaAquifero}, variable: ${variable}`);
  }
  
  // Buscar todos os dados usando paginação
  let allData: WellData[] = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await query
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      break; // Não há mais dados
    }
    
    allData = allData.concat(data);
    
    if (data.length < pageSize) {
      break; // Última página
    }
    
    page++;
  }
  
  return allData;
};

// Função para verificar valores únicos na coluna sistema_aquifero
export const checkSistemaAquiferoValues = async (variable: string): Promise<string[]> => {
  if (!supabase) {
    console.warn('Supabase não configurado');
    return [];
  }

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
    default:
      return [];
  }
  
  const { data, error } = await query.select('sistema_aquifero');
  
  if (error) {
    console.error('Erro ao verificar valores sistema_aquifero:', error);
    return [];
  }
  
  const uniqueValues = Array.from(new Set(data.map((row: any) => row.sistema_aquifero).filter(Boolean))) as string[];
  console.log(`Valores únicos em sistema_aquifero para ${variable}:`, uniqueValues);
  return uniqueValues;
};

// Função para buscar dados históricos de um poço específico
export const fetchWellHistory = async (
  variable: string,
  codigo: string,
  sistemaAquifero?: string
): Promise<WellData[]> => {
  // Se o Supabase não estiver configurado, retornar array vazio
  if (!supabase) {
    console.warn('Supabase não configurado. Configure as variáveis de ambiente REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY');
    return [];
  }

  let query: any;
  
  switch (variable) {
    case 'profundidade':
      query = supabase.from('piezo_tejo_loc');
      break;
    case 'condutividade':
      query = supabase.from('condut_tejo_loc');
      break;
    case 'nitrato':
      query = supabase.from('nitrato_tejo_loc');
      break;
    case 'precipitacao':
      query = supabase.from('precipitacao_tejo_loc');
      break;
    default:
      throw new Error(`Variável não suportada: ${variable}`);
  }
  
  // Filtrar por código do poço
  query = query.eq('codigo', codigo);
  
  // Aplicar filtro de sistema aquífero se especificado (apenas para variáveis que têm esta coluna)
  if (sistemaAquifero && sistemaAquifero !== 'todos' && variable !== 'precipitacao') {
    const sistemaMap: { [key: string]: string } = {
      'AL': 'T7-ALUVIÕES DO TEJO',
      'MD': 'T1-BACIA DO TEJO-SADO / MARGEM DIREITA',
      'ME': 'T3-BACIA DO TEJO-SADO / MARGEM ESQUERDA'
    };
    
    const sistemaReal = sistemaMap[sistemaAquifero];
    if (sistemaReal) {
      query = query.eq('sistema_aquifero', sistemaReal);
    }
  }
  
  // Ordenar por data
  query = query.order('data', { ascending: true });
  
  // Buscar todos os dados históricos usando paginação
  let allData: WellData[] = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await query
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (error) {
      console.error('Erro ao buscar histórico do poço:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      break; // Não há mais dados
    }
    
    allData = allData.concat(data);
    
    if (data.length < pageSize) {
      break; // Última página
    }
    
    page++;
  }
  
  return allData;
}; 