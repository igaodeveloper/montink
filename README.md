# 🖨️ Montink - Plataforma de Print On Demand

<div align="center">
  
![Montink](https://img.shields.io/badge/Montink-Print%20On%20Demand-blue?style=for-the-badge&logo=shop&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.2.23-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

</div>

<p align="center">
  <b>Ganhe dinheiro vendendo produtos da sua marca sem precisar investir em estoque, produção ou logística.</b>
</p>

---

## ✨ Características

- 🎨 **Sua Marca, Nosso Cuidado** - Crie sua loja com sua identidade visual
- 🛒 **Catálogo Completo** - Mais de 35 produtos personalizáveis
- 🔍 **Gerenciamento Simplificado** - Controle de pedidos, produtos e clientes
- 📦 **Logística Integrada** - Produção e envio automáticos
- 💳 **Integração de Pagamentos** - Receba por suas vendas de forma segura
- 🌙 **Modo Escuro/Claro** - Personalização da experiência visual
- 🚀 **Desempenho Otimizado** - Carregamento rápido e experiência fluida
- 📱 **Totalmente Responsivo** - Funciona em todos os dispositivos
- 🔐 **Autenticação via Supabase** - Login seguro e gestão de usuários

---

## 🖥️ Demonstração

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Montink+Platform+Screenshot" alt="Demonstração da plataforma" width="800"/>
</p>

---

## 🚀 Tecnologias

Este projeto utiliza um conjunto moderno de tecnologias:

- **Frontend**:
  - [Next.js 14](https://nextjs.org/) - Framework React com SSR/SSG
  - [TypeScript](https://www.typescriptlang.org/) - JavaScript tipado
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
  - [Framer Motion](https://www.framer.com/motion/) - Animações fluidas
  - [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis e customizáveis
  - [Lucide Icons](https://lucide.dev/) - Ícones modernos e consistentes

- **Backend**:
  - [Supabase](https://supabase.com/) - Backend-as-a-Service com PostgreSQL
  - [Stripe](https://stripe.com/) - Processamento de pagamentos

- **DevOps**:
  - [Vercel](https://vercel.com/) - Hospedagem e deploy contínuo

---

## 🛠️ Instalação

Siga estes passos para configurar o ambiente de desenvolvimento:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/montink.git
cd montink

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local baseado no exemplo .env.example
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação em funcionamento.

---

## 📋 Arquitetura do Projeto

```
src/
├── app/             # Rotas e páginas da aplicação (Next.js App Router)
├── components/      # Componentes reutilizáveis
│   ├── product/     # Componentes relacionados a produtos
│   └── ui/          # Componentes de interface
├── lib/             # Utilidades e funções auxiliares
```

---

## 🧩 Componentes Principais

### Produtos

- **ProductGallery**: Galeria de imagens com zoom e navegação
- **ProductInfo**: Informações detalhadas, seleção de tamanhos e cores
- **ShippingCalculator**: Cálculo de frete baseado no CEP

### UI

- **Header**: Navegação principal e acesso rápido ao carrinho
- **Footer**: Links de rodapé, informações de contato e redes sociais
- **ThemeSwitcher**: Alternador entre temas claro e escuro

---

## 🔄 Fluxo de Print On Demand

1. **Criação da Conta**: Usuário cria sua conta na plataforma
2. **Personalização da Loja**: Configuração da identidade visual da marca
3. **Criação de Produtos**: Upload de designs e aplicação em produtos
4. **Divulgação e Vendas**: Divulgação da loja e início das vendas
5. **Processamento Automático**: Produtos vendidos são produzidos e enviados automaticamente
6. **Lucro**: Usuário recebe o valor da venda menos o custo do produto

---

## 🌐 Integração com APIs

- **Supabase**: Armazenamento de dados de produtos, usuários e pedidos
- **Stripe**: Processamento de pagamentos e gestão de assinaturas
- **Serviços de Logística**: Integração com empresas de entrega

---

## 📱 Responsividade

A interface se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop**: Experiência completa com layout expansivo
- **Tablet**: Layout otimizado para telas médias
- **Mobile**: Navegação adaptada para uso com uma mão

---

## 🔮 Próximas Funcionalidades

- [ ] Sistema de afiliados
- [ ] Integração com marketplaces
- [ ] Análises e relatórios avançados
- [ ] Sistema de cupons e descontos
- [ ] Integração com redes sociais
- [ ] PWA (Progressive Web App)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  Feito com muito ❤️ & ☕, de BH para o Mundo. Desde 2014.
</p>
