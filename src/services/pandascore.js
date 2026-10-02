const BASE_URL = "https://api.pandascore.co/valorant";
const TOKEN = import.meta.env.VITE_PANDASCORE_TOKEN;

async function get(caminho, params = {}) {
  if (!TOKEN)
    throw new Error(
      "Token da PandaScore não configurado (veja o arquivo .env.example)",
    );

  const query = new URLSearchParams(params).toString();
  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}?${query}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à PandaScore. Verifique sua conexão e tente novamente.",
    );
  }

  if (!resposta.ok) {
    const mensagens = {
      401: "A PandaScore não aceitou o token configurado. Confira o VITE_PANDASCORE_TOKEN.",
      403: "A PandaScore recusou o acesso. Confira as permissões do token e o plano contratado.",
      429: "O limite de requisições da PandaScore foi atingido. Aguarde um pouco e tente novamente.",
    };
    throw new Error(
      mensagens[resposta.status] ||
        `A PandaScore respondeu com erro ${resposta.status}. Tente novamente mais tarde.`,
    );
  }
  return resposta.json();
}

// tipo: 'upcoming' (próximas), 'running' (ao vivo) ou 'past' (resultados)
export function listarPartidas(tipo = "upcoming", porPagina = 30) {
  return get(`/matches/${tipo}`, { per_page: porPagina });
}

// Busca uma página de times por vez, para não estourar o limite de chamadas da API
// `nome` (opcional) filtra os times pelo nome direto na API
export function listarTimes(pagina = 1, porPagina = 30, nome = "") {
  const params = { per_page: porPagina, page: pagina };
  if (nome) params["search[name]"] = nome;
  return get("/teams", params);
}
