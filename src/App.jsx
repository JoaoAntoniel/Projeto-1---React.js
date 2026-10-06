import { useEffect, useMemo, useState } from 'react'
import { Alert, AppBar, Box, Button, CircularProgress, Container, FormControlLabel, Grid, Stack, Switch, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import Filtros from './components/Filtros'
import PartidaCard from './components/PartidaCard'
import TimesTab from './components/TimesTab'
import { listarPartidas } from './services/pandascore'
import { useFavoritos } from './context/FavoritosContext'

export default function App() {
  const [aba, setAba] = useState('partidas')
  const [tipo, setTipo] = useState('upcoming')
  const [partidas, setPartidas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)
  const [busca, setBusca] = useState('')
  const [campeonato, setCampeonato] = useState('')
  const [soFavoritos, setSoFavoritos] = useState(false)
  const { favoritos } = useFavoritos()

  useEffect(() => {
    if (aba !== 'partidas') return undefined

    let ativo = true
    setCarregando(true)
    setErro(null)
    listarPartidas(tipo)
      .then((resultado) => {
        if (ativo) setPartidas(Array.isArray(resultado) ? resultado : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message || 'Não foi possível carregar as partidas.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [aba, tipo, tentativa])

  // Lista de campeonatos sem repetição, recalculada só quando as partidas mudam
  const campeonatos = useMemo(
    () => [...new Set(partidas.map((p) => p.league?.name).filter(Boolean))].sort(),
    [partidas],
  )

  // Partidas filtradas, recalculadas só quando partidas, busca, campeonato ou favoritos mudam
  const partidasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const idsFavoritos = new Set(favoritos.map((t) => t.id))
    return partidas.filter((p) => {
      const times = (p.opponents ?? []).map((o) => o.opponent)
      const doCampeonato = !campeonato || p.league?.name === campeonato
      const temTime = !termo || times.some((t) => t?.name?.toLowerCase().includes(termo))
      const temFavorito = !soFavoritos || times.some((t) => idsFavoritos.has(t?.id))
      return doCampeonato && temTime && temFavorito
    })
  }, [partidas, busca, campeonato, soFavoritos, favoritos])

  return (
    <>
      <AppBar position="sticky" className="site-header">
        <Toolbar sx={{ minHeight: 64 }}>
          <Box className="brand-mark" aria-hidden="true" />
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', lineHeight: 1.15 }}>Valorant Esports</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.62)', letterSpacing: '.08em' }}>
              CENTRAL COMPETITIVA
            </Typography>
          </Box>
        </Toolbar>
        <Tabs value={aba} onChange={(_, v) => setAba(v)} textColor="inherit" indicatorColor="secondary" centered>
          <Tab value="partidas" label="Partidas" />
          <Tab value="times" label="Times" />
        </Tabs>
        {aba === 'partidas' && (
          <Tabs value={tipo} onChange={(_, v) => setTipo(v)} textColor="inherit" indicatorColor="secondary" centered>
            <Tab value="upcoming" label="Próximas" />
            <Tab value="running" label="Ao vivo" />
            <Tab value="past" label="Resultados" />
          </Tabs>
        )}
      </AppBar>

      <Container className="page-shell">
        <Box className="page-intro">
          <Typography className="page-eyebrow">VALORANT · CENÁRIO COMPETITIVO</Typography>
          <Typography variant="h4" component="h1">
            {aba === 'times' ? 'Times' : 'Partidas'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {aba === 'times'
              ? 'Explore organizações e seus elencos.'
              : 'Acompanhe a agenda, os confrontos ao vivo e os resultados.'}
          </Typography>
        </Box>
        {aba === 'times' ? <TimesTab /> : (
          <>
            {carregando ? (
              <Stack role="status" aria-label="Carregando partidas" alignItems="center" spacing={1.5} sx={{ py: 6 }}>
                <CircularProgress />
                <Typography color="text.secondary">Carregando partidas...</Typography>
              </Stack>
            ) : erro ? (
              <Alert
                severity="error"
                action={(
                  <Button color="inherit" size="small" onClick={() => setTentativa((atual) => atual + 1)}>
                    Tentar novamente
                  </Button>
                )}
              >
                {erro}
              </Alert>
            ) : (
              <>
                <Filtros
                  busca={busca}
                  onBusca={setBusca}
                  campeonato={campeonato}
                  onCampeonato={setCampeonato}
                  campeonatos={campeonatos}
                />
                <FormControlLabel
                  control={<Switch checked={soFavoritos} onChange={(e) => setSoFavoritos(e.target.checked)} />}
                  label="Só partidas dos meus times favoritos"
                  sx={{ mt: -1, mb: 2 }}
                />

                {partidasFiltradas.length === 0 && (
                  <Alert severity="info">Nenhuma partida encontrada.</Alert>
                )}

                {partidasFiltradas.length > 0 && (
                  <Grid container spacing={2}>
                    {partidasFiltradas.map((p) => (
                      <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <PartidaCard partida={p} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  )
}
