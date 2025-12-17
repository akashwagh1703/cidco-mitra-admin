import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import AppProviders from './components/providers/AppProviders'
import useUIStore from './store/uiStore'

function App() {
  const { theme } = useUIStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <AppProviders>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
