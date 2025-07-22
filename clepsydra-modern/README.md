# Clepsydra Frontend - Versão Moderna

Este é o novo frontend do projeto Clepsydra, desenvolvido com tecnologias modernas e escaláveis.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para aplicações React
- **Lucide React** - Ícones modernos e leves

### Mapas e Visualização
- **Leaflet** - Biblioteca de mapas interativos
- **React Leaflet** - Componentes React para Leaflet

### Infraestrutura
- **GitHub Pages** - Hospedagem estática
- **Cloudflare CDN** - Rede de entrega de conteúdo
- **Varnish Cache** - Cache de proxy reverso
- **HSTS** - Segurança de transporte HTTP estrito

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm start

# Construir para produção
npm run build

# Executar testes
npm test
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── contexts/      # Contextos React (estado global)
├── utils/         # Funções utilitárias
├── assets/        # Recursos estáticos
└── App.tsx        # Componente principal
```

## 🎨 Design System

O projeto utiliza um design system consistente com:

- **Cores principais**: Clepsydra Blue (#174192)
- **Fonte**: Inter (Google Fonts)
- **Layout**: Responsivo com Tailwind CSS
- **Componentes**: Reutilizáveis e acessíveis

## 🔧 Configuração

### Tailwind CSS
O Tailwind está configurado com cores customizadas e plugins para formulários e tipografia.

### TypeScript
Configuração estrita para melhor qualidade de código e detecção de erros.

## 📱 Funcionalidades

- [x] Página inicial com seleção de projetos
- [x] Navegação responsiva
- [x] Roteamento entre páginas
- [x] Layout consistente
- [ ] Integração com mapas (Leaflet)
- [ ] Visualizações de dados
- [ ] Monitoramento em tempo real

## 🚀 Deploy

O projeto está configurado para deploy no GitHub Pages:

```bash
npm run build
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido por

Diogo Pinto - [GitHub](https://github.com/clepsydraisa/clepsydra_isa)
