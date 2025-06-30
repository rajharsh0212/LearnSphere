import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
  <AuthProvider>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </AuthProvider>
  </StrictMode>
  </BrowserRouter>,
)
