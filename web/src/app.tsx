import './global.css'

import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from './components/theme/theme-provider'
import { router } from './router'

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="controlsell001">
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
