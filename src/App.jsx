import { useEffect, useState } from 'react'
import { Alert, AppBar, Box, CircularProgress, Container, Grid, Toolbar, Typography } from '@mui/material'
import PokemonCard from './components/PokemonCard'
import { listarPokemons } from './services/pokeapi'

export default function App() {
  const [pokemons, setPokemons] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    listarPokemons()
      .then(setPokemons)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Pokédex</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {carregando && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {erro && <Alert severity="error">{erro}</Alert>}

        <Grid container spacing={2}>
          {pokemons.map((p) => (
            <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <PokemonCard pokemon={p} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
