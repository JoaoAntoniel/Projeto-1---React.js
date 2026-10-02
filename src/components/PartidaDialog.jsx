import { useEffect, useState } from 'react'
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { listarJogosDaPartida } from '../services/pandascore'

function nomeDoMapa(jogo) {
  if (typeof jogo.map === 'string') return jogo.map
  return jogo.map?.name || jogo.map_name || 'Mapa não informado'
}

export default function PartidaDialog({ partida, open, onClose }) {
  const [jogos, setJogos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!open || !partida?.id) return undefined

    let ativo = true
    setCarregando(true)
    setErro(null)
    setJogos([])

    listarJogosDaPartida(partida.id)
      .then((resultado) => {
        if (ativo) setJogos(Array.isArray(resultado) ? resultado : [])
      })
      .catch((error) => {
        if (ativo) setErro(error.message || 'Não foi possível carregar os jogos desta partida.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [open, partida?.id])

  const times = (partida?.opponents || []).map((item) => item.opponent?.name).filter(Boolean)
  const confronto = times.length ? times.join(' vs ') : 'Partida'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="partida-dialog-title">
      <DialogTitle id="partida-dialog-title">{confronto}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {[partida?.league?.name, partida?.serie?.full_name].filter(Boolean).join(' · ') || 'Competição não informada'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {partida?.number_of_games ? `Série MD${partida.number_of_games}` : 'Formato da série não informado'}
          </Typography>
        </Stack>

        <Divider />
        <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
          Jogos e mapas
        </Typography>

        {carregando && (
          <Stack role="status" aria-label="Carregando jogos" alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={28} />
          </Stack>
        )}
        {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
        {!carregando && !erro && jogos.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>Ainda não há jogos ou mapas registrados nesta partida.</Alert>
        )}
        {!carregando && !erro && jogos.length > 0 && (
          <List disablePadding>
            {jogos.map((jogo, index) => (
              <ListItem key={jogo.id ?? jogo.position ?? index} divider>
                <ListItemText
                  primary={`Jogo ${jogo.position ?? index + 1}`}
                  secondary={nomeDoMapa(jogo)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}
