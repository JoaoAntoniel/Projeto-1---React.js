import { MenuItem, Stack, TextField } from '@mui/material'

// A caixa de campeonato só aparece se o pai passar `campeonatos`
export default function Filtros({ busca, onBusca, rotuloBusca = 'Buscar time', campeonato, onCampeonato, campeonatos }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        label={rotuloBusca}
        value={busca}
        onChange={(e) => onBusca(e.target.value)}
        fullWidth
      />
      {campeonatos && (
        <TextField
          select
          label="Campeonato"
          value={campeonato}
          onChange={(e) => onCampeonato(e.target.value)}
          sx={{ minWidth: { sm: 260 } }}
        >
          <MenuItem value="">Todos</MenuItem>
          {campeonatos.map((nome) => (
            <MenuItem key={nome} value={nome}>{nome}</MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  )
}
