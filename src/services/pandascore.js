const BASE_URL = 'https://api.pandascore.co/valorant'
const TOKEN = import.meta.env.VITE_PANDASCORE_TOKEN

async function get(caminho, params = {}) {
  if (!TOKEN) throw new Error('Token da PandaScore não configurado (veja o arquivo .env.example)')

  const query = new URLSearchParams(params).toString()
  const resposta = await fetch(`${BASE_URL}${caminho}?${query}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao buscar dados da PandaScore`)
  return resposta.json()
}

// tipo: 'upcoming' (próximas), 'running' (ao vivo) ou 'past' (resultados)
export function listarPartidas(tipo = 'upcoming', porPagina = 30) {
  return get(`/matches/${tipo}`, { per_page: porPagina })
}
