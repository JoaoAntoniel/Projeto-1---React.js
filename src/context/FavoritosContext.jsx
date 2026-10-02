import { createContext, useContext, useEffect, useReducer } from 'react'

const CHAVE = 'valorant-favoritos'
const FavoritosContext = createContext(null)

// Guarda só o necessário de cada time para mostrar o card sem chamar a API
function resumirTime(time) {
  const { id, name, acronym, image_url, players } = time
  return { id, name, acronym, image_url, players: players ?? [] }
}

// O reducer recebe o estado atual e uma ação, e devolve o novo estado
function favoritosReducer(estado, acao) {
  switch (acao.type) {
    case 'alternar': {
      const jaFavorito = estado.some((t) => t.id === acao.time.id)
      return jaFavorito
        ? estado.filter((t) => t.id !== acao.time.id)
        : [...estado, resumirTime(acao.time)]
    }
    case 'limpar':
      return []
    default:
      throw new Error(`Ação desconhecida: ${acao.type}`)
  }
}

// Lê os favoritos salvos no navegador (ou começa vazio)
function carregarSalvos() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE))
    return Array.isArray(salvo) ? salvo : []
  } catch {
    return []
  }
}

export function FavoritosProvider({ children }) {
  const [favoritos, dispatch] = useReducer(favoritosReducer, undefined, carregarSalvos)

  // Salva no navegador sempre que a lista muda
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(favoritos))
    } catch {
      // Sem acesso ao armazenamento: os favoritos valem só até fechar a página
    }
  }, [favoritos])

  const valor = {
    favoritos,
    ehFavorito: (id) => favoritos.some((t) => t.id === id),
    alternar: (time) => dispatch({ type: 'alternar', time }),
    limpar: () => dispatch({ type: 'limpar' }),
  }

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext)
  if (!contexto) throw new Error('useFavoritos precisa estar dentro de <FavoritosProvider>')
  return contexto
}
