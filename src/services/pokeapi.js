const BASE_URL = 'https://pokeapi.co/api/v2'

// Busca os primeiros `limit` Pokémon com id, nome e imagem
export async function listarPokemons(limit = 151) {
  const resposta = await fetch(`${BASE_URL}/pokemon?limit=${limit}`)
  if (!resposta.ok) throw new Error('Falha ao buscar Pokémon')
  const dados = await resposta.json()

  return dados.results.map((p) => {
    const id = Number(p.url.split('/').filter(Boolean).pop())
    return {
      id,
      nome: p.name,
      imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    }
  })
}
