import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { UserManager } from 'oidc-client-ts'
import { backendConfig } from './oauth/config'

import "@nordhealth/css"
import "./index.css"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const userManager = new UserManager(backendConfig.settings);
const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({ routeTree, context: { userManager } })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}