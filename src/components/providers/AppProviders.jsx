import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from 'react-error-boundary'
import { queryClient } from '../../config/queryClient'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default function AppProviders({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}
