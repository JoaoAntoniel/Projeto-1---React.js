# Valorant Esports — Projeto 1 (React.js)

SPA em React que mostra partidas do cenário competitivo de Valorant (próximas, ao vivo e resultados) usando a [API da PandaScore](https://developers.pandascore.co/).

## Requisitos do projeto
- **API JSON:** PandaScore (Valorant)
- **Hook/recurso do React:** useReducer (times favoritos, em `src/context/FavoritosContext.jsx`) e useMemo (busca e filtros de partidas)
- **Biblioteca externa:** Material UI (MUI)

## Como rodar
1. Crie uma conta gratuita em https://app.pandascore.co e copie seu token.
2. Copie `.env.example` para `.env` e cole o token:
   ```
   VITE_PANDASCORE_TOKEN=seu_token_aqui
   ```
3. Rode:
   ```bash
   npm install
   npm run dev
   ```

## Equipe e responsabilidades
- **João Vitor Antoniel** — estrutura inicial, listagem de partidas, busca e filtro (useMemo), favoritos (useReducer), acabamento visual
- **Gabriel de Peder** — aba de times, janela de detalhes da partida, tratamento de erros/carregamento, README final

## Uso de ferramentas de apoio
- Claude Code (IA) ajudou na estrutura inicial do projeto e nos componentes.
- Vite para criar e rodar o projeto.
