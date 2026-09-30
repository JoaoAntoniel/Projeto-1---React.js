import { useEffect, useMemo, useState } from 'react'
import { Alert, AppBar, Box, CircularProgress, Container, Grid, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import Filtros from './components/Filtros'
import PartidaCard from './components/PartidaCard'
import TimesTab from './components/TimesTab'
import { listarPartidas } from './services/pandascore'

export default function App() {
  const [aba, setAba] = useState('partidas')
  const [tipo, setTipo] = useState('upcoming')
  const [partidas, setPartidas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState('')
  const [campeonato, setCampeonato] = useState('')

  useEffect(() => {
    if (aba !== 'partidas') return undefined

    let ativo = true
    setCarregando(true)
    setErro(null)
    setCampeonato('')
    listarPartidas(tipo)
      .then((resultado) => {
        if (ativo) setPartidas(Array.isArray(resultado) ? resultado : [])
      })
      .catch((e) => {
        if (ativo) setErro(e.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [aba, tipo])

  // Lista de campeonatos sem repetição, recalculada só quando as partidas mudam
  const campeonatos = useMemo(
    () => [...new Set(partidas.map((p) => p.league?.name).filter(Boolean))].sort(),
    [partidas],
  )

  // Partidas filtradas, recalculadas só quando partidas, busca ou campeonato mudam
  const partidasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return partidas.filter((p) => {
      const doCampeonato = !campeonato || p.league?.name === campeonato
      const temTime = !termo || (p.opponents ?? []).some((o) => o.opponent?.name?.toLowerCase().includes(termo))
      return doCampeonato && temTime
    })
  }, [partidas, busca, campeonato])

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#ff4655' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Valorant Esports</Typography>
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

      <Container sx={{ py: 3 }}>
        {aba === 'times' ? <TimesTab /> : (
          <>
            {carregando && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {erro && <Alert severity="error">{erro}</Alert>}
            <Filtros
              busca={busca}
              onBusca={setBusca}
              campeonato={campeonato}
              onCampeonato={setCampeonato}
              campeonatos={campeonatos}
            />

            {!carregando && !erro && partidasFiltradas.length === 0 && (
              <Alert severity="info">Nenhuma partida encontrada.</Alert>
            )}

            {!carregando && !erro && (
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
      </Container>
    </>
  )
}
