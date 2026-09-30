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

export async function listarTimes(porPagina = 100) {
  const times = []
  let pagina = 1
  let resultado

  do {
    resultado = await get('/teams', { per_page: porPagina, page: pagina })
    if (!Array.isArray(resultado)) return []

    times.push(...resultado)
    pagina += 1
  } while (resultado.length === porPagina)

  return times
}
