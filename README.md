# 🖨️ Montink - Plataforma de Print On Demand

✨ Características

🎨 Sua Marca, Nosso Cuidado - Crie sua loja com sua identidade visual

🛒 Catálogo Completo - Mais de 35 produtos personalizáveis

🔍 Gerenciamento Simplificado - Controle de pedidos, produtos e clientes

📦 Logística Integrada - Produção e envio automáticos

💳 Integração de Pagamentos - Receba por suas vendas de forma segura

🌙 Modo Escuro/Claro - Personalização da experiência visual

🚀 Desempenho Otimizado - Carregamento rápido e experiência fluida

📱 Totalmente Responsivo - Funciona em todos os dispositivos

🔐 Autenticação via Supabase - Login seguro e gestão de usuários

🟢 Pré-requisitos

Antes de prosseguir, certifique-se de ter instalado e configurado o Node.js 20:

Gerenciador de versões (opcional mas recomendado):

Usando nvm:

nvm install 20
nvm use 20

Ou usando asdf:

asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs 20
asdf global nodejs 20

Verifique a versão ativa:

node -v # deve exibir v20.x.x

🛠️ Instalação e Execução

Siga estes passos para configurar e executar o ambiente de desenvolvimento:

# Clone o repositório

git clone https://github.com/seu-usuario/montink.git
cd montink

# Garanta que está usando Node.js 20

node -v

# Instale as dependências

npm install

# Configure as variáveis de ambiente

# Crie um arquivo .env.local baseado no exemplo .env.example

cp .env.example .env.local

# Inicie o servidor de desenvolvimento

npm run dev

Acesse http://localhost:3000 para ver a aplicação em funcionamento.

📋 Arquitetura do Projeto

src/
├── app/ # Rotas e páginas da aplicação (Next.js App Router)
├── components/ # Componentes reutilizáveis
│ ├── product/ # Componentes relacionados a produtos
│ └── ui/ # Componentes de interface
├── lib/ # Utilidades e funções auxiliares

🧩 Componentes Principais

Produtos

ProductGallery: Galeria de imagens com zoom e navegação

ProductInfo: Informações detalhadas, seleção de tamanhos e cores

ShippingCalculator: Cálculo de frete baseado no CEP

UI

Header: Navegação principal e acesso rápido ao carrinho

Footer: Links de rodapé, informações de contato e redes sociais

ThemeSwitcher: Alternador entre temas claro e escuro

🔄 Fluxo de Print On Demand

Criação da Conta: Usuário cria sua conta na plataforma

Personalização da Loja: Configuração da identidade visual da marca

Criação de Produtos: Upload de designs e aplicação em produtos

Divulgação e Vendas: Divulgação da loja e início das vendas

Processamento Automático: Produtos vendidos são produzidos e enviados automaticamente

Lucro: Usuário recebe o valor da venda menos o custo do produto

🌐 Integração com APIs

Supabase: Armazenamento de dados de produtos, usuários e pedidos

Stripe: Processamento de pagamentos e gestão de assinaturas

Serviços de Logística: Integração com empresas de entrega

📱 Responsividade

A interface se adapta automaticamente a diferentes tamanhos de tela:

Desktop: Experiência completa com layout expansivo

Tablet: Layout otimizado para telas médias

Mobile: Navegação adaptada para uso com uma mão

🔮 Próximas Funcionalidades

🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/amazing-feature)

Commit suas mudanças (git commit -m 'Add some amazing feature')

Push para a branch (git push origin feature/amazing-feature)

Abra um Pull Request

📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.
