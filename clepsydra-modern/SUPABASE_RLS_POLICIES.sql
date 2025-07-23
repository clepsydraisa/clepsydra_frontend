-- Script para configurar políticas RLS no Supabase
-- Este script permite acesso completo aos dados das tabelas

-- 1. Desabilitar RLS nas tabelas (se necessário)
ALTER TABLE piezo_tejo_loc DISABLE ROW LEVEL SECURITY;
ALTER TABLE condut_tejo_loc DISABLE ROW LEVEL SECURITY;
ALTER TABLE nitrato_tejo_loc DISABLE ROW LEVEL SECURITY;
ALTER TABLE precipitacao_tejo_loc DISABLE ROW LEVEL SECURITY;

-- 2. Ou, se preferir manter RLS habilitado, criar políticas permissivas:

-- Política para piezo_tejo_loc
DROP POLICY IF EXISTS "Allow all access to piezo_tejo_loc" ON piezo_tejo_loc;
CREATE POLICY "Allow all access to piezo_tejo_loc" ON piezo_tejo_loc
    FOR ALL USING (true);

-- Política para condut_tejo_loc
DROP POLICY IF EXISTS "Allow all access to condut_tejo_loc" ON condut_tejo_loc;
CREATE POLICY "Allow all access to condut_tejo_loc" ON condut_tejo_loc
    FOR ALL USING (true);

-- Política para nitrato_tejo_loc
DROP POLICY IF EXISTS "Allow all access to nitrato_tejo_loc" ON nitrato_tejo_loc;
CREATE POLICY "Allow all access to nitrato_tejo_loc" ON nitrato_tejo_loc
    FOR ALL USING (true);

-- Política para precipitacao_tejo_loc
DROP POLICY IF EXISTS "Allow all access to precipitacao_tejo_loc" ON precipitacao_tejo_loc;
CREATE POLICY "Allow all access to precipitacao_tejo_loc" ON precipitacao_tejo_loc
    FOR ALL USING (true);

-- 3. Verificar se as políticas foram aplicadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('piezo_tejo_loc', 'condut_tejo_loc', 'nitrato_tejo_loc', 'precipitacao_tejo_loc');

-- 4. Verificar se RLS está desabilitado (se aplicável)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('piezo_tejo_loc', 'condut_tejo_loc', 'nitrato_tejo_loc', 'precipitacao_tejo_loc'); 