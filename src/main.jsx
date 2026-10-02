import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import App from './App.jsx'
import { FavoritosProvider } from './context/FavoritosContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <FavoritosProvider>
      <App />
    </FavoritosProvider>
  </StrictMode>,
)
