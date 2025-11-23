/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { registerSW } from 'virtual:pwa-register'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from '../providers/query_provider'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Show prompt to user to refresh the page
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <QueryProvider>
        <App {...props} />
      </QueryProvider>,
    )
  },
})
