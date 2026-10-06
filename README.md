# Valorant Esports

Aplicação web responsiva para acompanhar partidas e explorar times e elencos do cenário competitivo de VALORANT. Os dados são consultados na API pública da [PandaScore](https://developers.pandascore.co/), usando os recursos disponíveis no plano gratuito Fixtures.

## Funcionalidades

- Agenda de partidas próximas, partidas em andamento e resultados.
- Filtros por nome de time e campeonato.
- Cartões de confronto com equipes, placar quando disponível, data e formato da série.
- Janela de detalhes com informações da partida e links de transmissão fornecidos pela API.
- Lista paginada de times, busca por nome e exibição de logos e jogadores quando informados pela API.
- Favoritos de times, filtro de partidas dos favoritos e persistência no navegador.
- Estados de carregamento, mensagens para listas vazias e erros com opção para tentar novamente.
- Interface adaptável para telas menores e maiores.

## API e plano gratuito

O cliente limita as chamadas aos seguintes endpoints gratuitos de VALORANT:

| Recurso usado | Endpoint | Plano |
| --- | --- | --- |
| Próximas partidas | `GET /valorant/matches/upcoming` | Free / Fixtures |
| Partidas em andamento | `GET /valorant/matches/running` | Free / Fixtures |
| Resultados | `GET /valorant/matches/past` | Free / Fixtures |
| Times e dados de elenco disponíveis | `GET /valorant/teams` | Free / Fixtures |

Também estão no nível gratuito de VALORANT os endpoints de consulta de jogadores (`GET /valorant/players`), ligas (`GET /valorant/leagues`) e torneios futuros (`GET /valorant/tournaments/upcoming`). Eles não são chamados por esta versão do app.

Jogos individuais dentro de uma partida, estatísticas pós-jogo, eventos e rounds não fazem parte deste cliente porque exigem planos pagos da PandaScore. Em particular, `GET /valorant/matches/{id}/games` requer plano Historical ou real-time. O serviço possui uma allowlist para impedir que novos caminhos sejam chamados por engano.

Consulte a [referência oficial de planos](https://developers.pandascore.co/docs/plan-reference), a [referência de partidas](https://developers.pandascore.co/reference/get_valorant_matches) e a [referência de times](https://developers.pandascore.co/reference/get_valorant_teams) para confirmar disponibilidade e campos retornados.

## Requisitos

- Node.js e npm em versões compatíveis com Vite 8.
- Uma conta PandaScore e um token de API. O acesso aos endpoints gratuitos ainda requer autenticação.

## Como instalar e executar

1. Clone o repositório e entre na pasta do projeto.

   ```bash
   git clone https://github.com/JoaoAntoniel/Projeto-1---React.js.git
   cd Projeto-1---React.js
   ```

2. Instale as dependências.

   ```bash
   npm install
   ```

3. Copie `.env.example` para `.env` e informe seu token PandaScore.

   ```env
   VITE_PANDASCORE_TOKEN=seu_token_aqui
   ```

4. Inicie o servidor local.

   ```bash
   npm run dev
   ```

Abra no navegador o endereço local exibido pelo Vite.

### Outros comandos

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # serve localmente a versão gerada
npm run lint     # analisa o código com oxlint
```

## Como usar

1. Na aba **Partidas**, escolha **Próximas**, **Ao vivo** ou **Resultados**.
2. Pesquise pelo nome de uma equipe ou filtre pelo campeonato.
3. Abra um cartão para consultar a data, a competição e as transmissões disponíveis.
4. Na aba **Times**, pesquise uma organização e navegue pela lista usando **Carregar mais**.
5. Use a estrela para salvar times. Ative **Só favoritos** para consultar os times salvos; na aba Partidas, o filtro correspondente mostra confrontos com ao menos um favorito.

Os favoritos ficam no armazenamento local do navegador e não são enviados à PandaScore.

## Segurança do token

O arquivo `.env` está no `.gitignore`; nunca faça commit do token. Como este projeto usa Vite no navegador, variáveis prefixadas com `VITE_` são incorporadas ao código do cliente e podem ser vistas por quem acessar a aplicação publicada. Para uma publicação pública, use um token apropriado para exposição no cliente e acompanhe seus limites, ou mova as chamadas para um servidor intermediário se precisar manter o token secreto. Não reutilize uma credencial privada ou administrativa no frontend.

## Tecnologias

- React 19 e JavaScript com módulos ES.
- Vite 8 para desenvolvimento e build.
- Material UI (MUI) para componentes e tema visual.
- API PandaScore para partidas, times e elencos.
- `useReducer` e Context para gerenciar favoritos; `useMemo` para filtros de partidas.

## Estrutura do projeto

```text
src/
├── components/
│   ├── BotaoFavorito.jsx   # ação de favoritar um time
│   ├── Filtros.jsx         # busca e filtro por campeonato
│   ├── PartidaCard.jsx     # cartão e entrada para os detalhes
│   ├── PartidaDialog.jsx   # detalhes e transmissões disponíveis
│   └── TimesTab.jsx        # listagem paginada de times e jogadores
├── context/
│   └── FavoritosContext.jsx
├── services/
│   └── pandascore.js       # chamadas gratuitas permitidas e erros da API
├── App.jsx
├── index.css               # estilos globais e ajustes responsivos
├── main.jsx                # montagem do React e provedores
└── theme.js                # tema Material UI
```

## Equipe e apoio

- **João Vitor Antoniel** — estrutura inicial, partidas, busca/filtros, favoritos e acabamento visual.
- **Gabriel de Peder** — aba de times, detalhes de partida, estados de carregamento/erro e documentação.
- **Ferramentas de IA** — Claude Code apoiou a estrutura inicial e os componentes; Codex foi usado para esta revisão de acesso à API, interface e documentação. As alterações devem ser revisadas pela equipe.
