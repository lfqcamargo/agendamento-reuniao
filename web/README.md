# Sistema de Agendamento de Reuniões - Frontend

Este repositório contém a interface web do sistema de agendamento de reuniões, desenvolvido para facilitar o gerenciamento de eventos corporativos e pessoais. O sistema permite criar, editar e visualizar reuniões de forma prática, com foco na usabilidade e eficiência.

## Tecnologias Utilizadas

- **React.js**: Biblioteca JavaScript para construção de interfaces dinâmicas.
- **TypeScript**: Tipagem estática para maior robustez no desenvolvimento.
- **Vite**: Ferramenta de build e desenvolvimento rápido.
- **Tailwind CSS**: Framework para estilização rápida e responsiva.
- **ESLint e Prettier**: Ferramentas para padronização e qualidade do código.

## Instalação e Configuração

Para executar o frontend do projeto localmente, siga estas etapas:

1. Clone o repositório:
   ```bash
   git clone https://github.com/lfqcamargo/agendamento-reuniao.git
   cd agendamento-reuniao/web
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra o navegador e acesse:
   ```
   http://localhost:3000
   ```

## Estrutura do Projeto

- **`src/`**: Contém os arquivos principais da aplicação.
- **`components/`**: Componentes reutilizáveis da interface.
- **`public/`**: Arquivos públicos como imagens e ícones.
- **`tailwind.config.js`**: Configuração do Tailwind CSS.
- **`vite.config.ts`**: Configuração do Vite.

## Funcionalidades

- Agendamento de reuniões com informações detalhadas (título, data, hora, local, etc.).
- Interface amigável com visualização de calendário.
- Notificações automatizadas para lembrar os participantes das reuniões.
- Suporte à personalização de temas e configurações.
