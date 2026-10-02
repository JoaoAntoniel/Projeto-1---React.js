import { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { listarTimes } from '../services/pandascore'
import Filtros from './Filtros'

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

const POR_PAGINA = 30

export default function TimesTab() {
  const [times, setTimes] = useState([])
  const [pagina, setPagina] = useState(1)
  const [temMais, setTemMais] = useState(true)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState('')
  const [termo, setTermo] = useState('')

  // Espera o usuário parar de digitar por 500 ms antes de buscar na API,
  // para não fazer uma chamada a cada letra (e não tomar erro 429)
  useEffect(() => {
    const espera = setTimeout(() => {
      const novoTermo = busca.trim()
      if (novoTermo === termo) return
      setCarregando(true)
      setErro(null)
      setTimes([])
      setPagina(1)
      setTermo(novoTermo)
    }, 500)
    return () => clearTimeout(espera)
  }, [busca, termo])

  useEffect(() => {
    let ativo = true

    listarTimes(pagina, POR_PAGINA, termo)
      .then((resultado) => {
        if (!ativo) return
        const novos = Array.isArray(resultado) ? resultado : []
        setTimes((anteriores) => (pagina === 1 ? novos : [...anteriores, ...novos]))
        setTemMais(novos.length === POR_PAGINA)
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
  }, [pagina, termo])

  function carregarMais() {
    setCarregando(true)
    setErro(null)
    setPagina((p) => p + 1)
  }

  const filtros = <Filtros busca={busca} onBusca={setBusca} rotuloBusca="Buscar time pelo nome" />

  if (carregando && times.length === 0) {
    return (
      <>
        {filtros}
        <Box role="status" aria-label="Carregando times" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </>
    )
  }

  if (times.length === 0) {
    return (
      <>
        {filtros}
        {erro ? <Alert severity="error">{erro}</Alert> : <Alert severity="info">Nenhum time encontrado.</Alert>}
      </>
    )
  }

  return (
    <>
      {filtros}
      <Grid container spacing={2}>
        {times.map((time) => (
          <Grid key={time.id ?? time.slug ?? time.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <TimeCard time={time} />
          </Grid>
        ))}
      </Grid>

      {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}

      {temMais && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" onClick={carregarMais} disabled={carregando}>
            {carregando ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </Box>
      )}
    </>
  )
}
