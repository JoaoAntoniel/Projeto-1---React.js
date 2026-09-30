import { useEffect, useState } from 'react'
import { Alert, AppBar, Box, CircularProgress, Container, Grid, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import PartidaCard from './components/PartidaCard'
import { listarPartidas } from './services/pandascore'

export default function App() {
  const [tipo, setTipo] = useState('upcoming')
  const [partidas, setPartidas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    setCarregando(true)
    setErro(null)
    listarPartidas(tipo)
      .then(setPartidas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [tipo])

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#ff4655' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Valorant Esports</Typography>
        </Toolbar>
        <Tabs value={tipo} onChange={(_, v) => setTipo(v)} textColor="inherit" indicatorColor="secondary" centered>
          <Tab value="upcoming" label="Próximas" />
          <Tab value="running" label="Ao vivo" />
          <Tab value="past" label="Resultados" />
        </Tabs>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {carregando && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {erro && <Alert severity="error">{erro}</Alert>}
        {!carregando && !erro && partidas.length === 0 && (
          <Alert severity="info">Nenhuma partida encontrada.</Alert>
        )}

        {!carregando && (
          <Grid container spacing={2}>
            {partidas.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PartidaCard partida={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  )
}
