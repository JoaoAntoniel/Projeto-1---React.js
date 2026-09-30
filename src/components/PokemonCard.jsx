import { Card, CardContent, CardMedia, Typography } from '@mui/material'

export default function PokemonCard({ pokemon }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardMedia
        component="img"
        image={pokemon.imagem}
        alt={pokemon.nome}
        sx={{ height: 140, objectFit: 'contain', bgcolor: 'grey.100', p: 1 }}
      />
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          #{String(pokemon.id).padStart(3, '0')}
        </Typography>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {pokemon.nome}
        </Typography>
      </CardContent>
    </Card>
  )
}
