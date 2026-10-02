import { IconButton, Tooltip } from '@mui/material'
import { useFavoritos } from '../context/FavoritosContext'

export default function BotaoFavorito({ time }) {
  const { ehFavorito, alternar } = useFavoritos()
  const favorito = ehFavorito(time.id)
  const texto = favorito ? `Remover ${time.name} dos favoritos` : `Adicionar ${time.name} aos favoritos`

  return (
    <Tooltip title={texto}>
      <IconButton
        onClick={() => alternar(time)}
        aria-label={texto}
        aria-pressed={favorito}
        sx={{ color: favorito ? '#ffb400' : 'grey.400', fontSize: 26, lineHeight: 1 }}
      >
        {favorito ? '★' : '☆'}
      </IconButton>
    </Tooltip>
  )
}
