import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import App from './App.jsx'
import './lib/index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
      <Toaster position="top-right" />
    </ThemeProvider>
  </BrowserRouter>
)