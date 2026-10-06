import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

const IDIOMAS = { pt: 'Português', en: 'Inglês', es: 'Espanhol', fr: 'Francês', ko: 'Coreano', ja: 'Japonês', zh: 'Chinês', tr: 'Turco', ru: 'Russo' }

// Transmissões em português primeiro, depois a principal, depois o resto
function ordenarTransmissoes(streams) {
  const peso = (s) => (s.language === 'pt' ? 0 : s.main ? 1 : 2)
  return [...streams].filter((s) => s.raw_url).sort((a, b) => peso(a) - peso(b))
}

export default function PartidaDialog({ partida, open, onClose }) {
  const transmissoes = ordenarTransmissoes(partida?.streams_list ?? [])
  const times = (partida?.opponents ?? []).map((item) => item.opponent).filter(Boolean)
  const confronto = times.length ? times.map((t) => t.name).join(' vs ') : 'Partida'
  const encerrada = partida?.status === 'finished'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="partida-dialog-title">
      <DialogTitle id="partida-dialog-title">{confronto}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {partida?.begin_at || partida?.scheduled_at
              ? new Date(partida.begin_at || partida.scheduled_at).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })
              : 'Data a definir'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {[partida?.league?.name, partida?.serie?.full_name].filter(Boolean).join(' · ') || 'Competição não informada'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {partida?.number_of_games ? `Série MD${partida.number_of_games}` : 'Formato da série não informado'}
          </Typography>
        </Stack>

        <Divider />
        <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
          Assistir
        </Typography>
        {transmissoes.length === 0 ? (
          <Alert severity="info" sx={{ mt: 1 }}>Nenhuma transmissão informada para esta partida.</Alert>
        ) : (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
            {transmissoes.map((s) => (
              <Button
                key={s.raw_url}
                variant={s.language === 'pt' ? 'contained' : 'outlined'}
                href={s.raw_url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={s.language === 'pt' ? { bgcolor: '#ff4655' } : undefined}
              >
                {encerrada ? 'Rever' : 'Assistir'} · {IDIOMAS[s.language] ?? s.language?.toUpperCase() ?? 'Transmissão'}
              </Button>
            ))}
          </Stack>
        )}

        <Divider />
      </DialogContent>
    </Dialog>
  )
}
