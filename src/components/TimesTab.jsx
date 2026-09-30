import { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { listarTimes } from '../services/pandascore'

function Jogador({ jogador }) {
  const nome = jogador?.name || jogador?.slug || 'Jogador sem nome'
  const apelido = jogador?.nickname

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar src={jogador?.image_url} alt={apelido || nome} sx={{ width: 36, height: 36 }}>
        {(apelido || nome).charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {apelido || nome}
        </Typography>
        {apelido && apelido !== nome && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {nome}
          </Typography>
        )}
      </Box>
    </Stack>
  )
}

function TimeCard({ time }) {
  const jogadores = Array.isArray(time.players) ? time.players : []

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={time.image_url}
            alt={time.name}
            variant="rounded"
            sx={{ width: 56, height: 56, bgcolor: 'grey.200' }}
          >
            {time.acronym?.[0] || time.name?.[0] || '?'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="h2" noWrap>
              {time.name || 'Time sem nome'}
            </Typography>
            {time.acronym && (
              <Typography variant="body2" color="text.secondary">
                {time.acronym}
              </Typography>
            )}
          </Box>
        </Stack>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Jogadores
        </Typography>
        {jogadores.length > 0 ? (
          <Stack spacing={1.25}>
            {jogadores.map((jogador, index) => (
              <Jogador key={jogador.id ?? jogador.slug ?? `${time.id}-${index}`} jogador={jogador} />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Elenco não disponível.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default function TimesTab() {
  const [times, setTimes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let ativo = true

    listarTimes()
      .then((resultado) => {
        if (ativo) setTimes(Array.isArray(resultado) ? resultado : [])
      })
      .catch((error) => {
        if (ativo) setErro(error.message || 'Não foi possível carregar os times.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  if (carregando) {
    return (
      <Box role="status" aria-label="Carregando times" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (erro) return <Alert severity="error">{erro}</Alert>
  if (times.length === 0) return <Alert severity="info">Nenhum time encontrado.</Alert>

  return (
    <Grid container spacing={2}>
      {times.map((time) => (
        <Grid key={time.id ?? time.slug ?? time.name} size={{ xs: 12, sm: 6, md: 4 }}>
          <TimeCard time={time} />
        </Grid>
      ))}
    </Grid>
  )
}
