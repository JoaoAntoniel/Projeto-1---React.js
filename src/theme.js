import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#e83d50', dark: '#c82e41', contrastText: '#fff' },
    secondary: { main: '#ff6676' },
    background: { default: '#f3f5f9', paper: '#fff' },
    text: { primary: '#172235', secondary: '#697589' },
    error: { main: '#d83a4e' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.04em' },
    h5: { fontWeight: 750, letterSpacing: '-0.03em' },
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'linear-gradient(110deg, #111a29 0%, #202d43 100%)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e6eaf1',
          boxShadow: '0 8px 24px rgba(26, 39, 61, 0.055)',
          transition: 'transform 180ms ease, box-shadow 180ms ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 10, paddingInline: 18 } },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
  },
})

export default theme
