-- Script para limpar e converter profundidade_nivel_agua de text para numeric
-- Executar no Supabase SQL Editor

-- 1. Ver valores atuais
SELECT 
  profundidade_nivel_agua,
  COUNT(*) as quantidade
FROM piezo_tejo_loc 
WHERE profundidade_nivel_agua IS NOT NULL
GROUP BY profundidade_nivel_agua
ORDER BY quantidade DESC
LIMIT 20;

-- 2. Limpar valores especiais
UPDATE piezo_tejo_loc 
SET profundidade_nivel_agua = CASE 
  WHEN profundidade_nivel_agua = '<' THEN NULL
  WHEN profundidade_nivel_agua = '(<)' THEN NULL
  WHEN profundidade_nivel_agua = '(<' THEN NULL
  WHEN profundidade_nivel_agua = '<)' THEN NULL
  WHEN profundidade_nivel_agua = '' THEN NULL
  -- Extrair números após caracteres especiais
  WHEN profundidade_nivel_agua ~ '^[<>()\s]*([0-9]+\.?[0-9]*)[<>()\s]*$' THEN 
    regexp_replace(profundidade_nivel_agua, '[<>()\s]', '', 'g')
  -- Se já é um número válido, manter
  WHEN profundidade_nivel_agua ~ '^[0-9]+\.?[0-9]*$' THEN profundidade_nivel_agua
  ELSE NULL
END
WHERE profundidade_nivel_agua IS NOT NULL;

-- 3. Converter para numeric
ALTER TABLE piezo_tejo_loc 
ALTER COLUMN profundidade_nivel_agua TYPE NUMERIC(8,2) 
USING profundidade_nivel_agua::NUMERIC;

-- 4. Verificar resultado
SELECT 
  COUNT(*) as total_registros,
  COUNT(profundidade_nivel_agua) as registros_com_valor,
  MIN(profundidade_nivel_agua) as valor_minimo,
  MAX(profundidade_nivel_agua) as valor_maximo
FROM piezo_tejo_loc; 