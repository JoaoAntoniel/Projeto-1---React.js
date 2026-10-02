import { useState } from 'react'
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material'
import PartidaDialog from './PartidaDialog'
import { useFavoritos } from '../context/FavoritosContext'

function Time({ time, placar, favorito }) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
      <Avatar src={time?.image_url} alt={time?.name} variant="rounded" sx={{ width: 56, height: 56, bgcolor: 'grey.200' }}>
        {time?.acronym?.[0] ?? '?'}
      </Avatar>
      <Typography variant="body2" noWrap sx={{ maxWidth: '100%' }}>
        {favorito && <span aria-label="Time favorito" style={{ color: '#ffb400' }}>★ </span>}
        {time?.name ?? 'A definir'}
      </Typography>
      {placar !== undefined && <Typography variant="h5">{placar}</Typography>}
    </Stack>
  )
}

export default function PartidaCard({ partida }) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false)
  const [a, b] = (partida.opponents ?? []).map((o) => o.opponent)
  const { ehFavorito } = useFavoritos()
  const temFavorito = ehFavorito(a?.id) || ehFavorito(b?.id)
  const placar = (time) => partida.results?.find((r) => r.team_id === time?.id)?.score
  const mostrarPlacar = partida.status !== 'not_started'
  const data = partida.begin_at ?? partida.scheduled_at

  return (
    <>
    <Card sx={{ height: '100%', ...(temFavorito ? { outline: '2px solid #ffb400' } : {}) }}>
      <CardActionArea
        onClick={() => setDetalhesAbertos(true)}
        aria-label={`Ver detalhes da partida entre ${a?.name ?? 'time a definir'} e ${b?.name ?? 'time a definir'}`}
        aria-haspopup="dialog"
        sx={{ height: '100%' }}
      >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {partida.league?.name} · {partida.serie?.full_name}
          </Typography>
          {partida.status === 'running' && <Chip label="AO VIVO" color="error" size="small" />}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Time time={a} placar={mostrarPlacar ? placar(a) : undefined} favorito={ehFavorito(a?.id)} />
          <Typography variant="h6" color="text.secondary">vs</Typography>
          <Time time={b} placar={mostrarPlacar ? placar(b) : undefined} favorito={ehFavorito(b?.id)} />
        </Stack>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {data ? new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Data a definir'}
            {partida.number_of_games ? ` · MD${partida.number_of_games}` : ''}
          </Typography>
          <Typography variant="caption" display="block" color="primary.main" sx={{ mt: 1 }}>
            Ver detalhes da partida
          </Typography>
        </Box>
      </CardContent>
      </CardActionArea>
    </Card>
    <PartidaDialog partida={partida} open={detalhesAbertos} onClose={() => setDetalhesAbertos(false)} />
    </>
  )
}
