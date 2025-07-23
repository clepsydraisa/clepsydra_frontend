# Configuração das Credenciais do Supabase

## 🔑 Suas Credenciais:

### Project ID:
```
wiqwksadgzmihxsqhqiu
```

### URL do Projeto:
```
https://wiqwksadgzmihxsqhqiu.supabase.co
```

### Anon Public Key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcXdrc2FkZ3ptaWh4c3FocWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTk3MDEsImV4cCI6MjA2ODMzNTcwMX0.4bVfqrL77Y51fyPt2cN34yMyOKIBVpuwLdg59qvfwTk
```

## 📝 Passos para Configurar:

### 1. Criar arquivo `.env` na raiz do projeto:
```bash
# Na pasta clepsydra-modern
touch .env
```

### 2. Adicionar as seguintes linhas ao arquivo `.env`:
```env
REACT_APP_SUPABASE_URL=https://wiqwksadgzmihxsqhqiu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcXdrc2FkZ3ptaWh4c3FocWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTk3MDEsImV4cCI6MjA2ODMzNTcwMX0.4bVfqrL77Y51fyPt2cN34yMyOKIBVpuwLdg59qvfwTk
```

### 3. Reiniciar o servidor de desenvolvimento:
```bash
npm start
```

## ✅ Após Configurar:

1. **A aplicação** deve conectar ao Supabase
2. **Os dados** da tabela `piezo_tejo_loc` devem aparecer no mapa
3. **Os filtros** devem funcionar corretamente
4. **Os gráficos** devem mostrar dados reais

## 🔒 Segurança:

- ✅ **Anon Public Key** é segura para usar no browser
- ✅ **Não precisa** da Service Role Secret Key
- ✅ **Apenas leitura** de dados é permitida

## 🚨 Se Não Funcionar:

1. **Verificar** se o arquivo `.env` está na pasta correta
2. **Reiniciar** o servidor após criar o arquivo
3. **Verificar** se as tabelas existem no Supabase
4. **Verificar** se as políticas RLS estão configuradas 