/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const PagesController = () => import('#controllers/pages_controller')
const PublicPagesController = () => import('#controllers/public_pages_controller')

// Home
router.on('/').renderInertia('home')

// Authentication routes
router
  .group(() => {
    router.get('/register', [AuthController, 'showRegister']).as('auth.register')
    router.post('/register', [AuthController, 'register'])
    router.get('/login', [AuthController, 'showLogin']).as('auth.login')
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')
  .use(middleware.guest())

// Authenticated routes
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout']).as('auth.logout')
    router.get('/dashboard', [DashboardController, 'index']).as('dashboard')

    // Landing pages
    router.get('/pages', [PagesController, 'index']).as('pages.index')
    router.get('/pages/create', [PagesController, 'create']).as('pages.create')
    router.post('/pages', [PagesController, 'store']).as('pages.store')
    router.get('/pages/:id', [PagesController, 'show']).as('pages.show')
    router.get('/pages/:id/edit', [PagesController, 'edit']).as('pages.edit')
    router.put('/pages/:id', [PagesController, 'update']).as('pages.update')
    router.delete('/pages/:id', [PagesController, 'destroy']).as('pages.destroy')

    // Link management
    router.post('/pages/:id/links', [PagesController, 'addLink']).as('pages.links.add')
    router.put('/pages/:id/links/:linkId', [PagesController, 'updateLink']).as('pages.links.update')
    router.delete('/pages/:id/links/:linkId', [PagesController, 'removeLink']).as('pages.links.remove')
    router.post('/pages/:id/links/reorder', [PagesController, 'reorderLinks']).as('pages.links.reorder')
  })
  .use(middleware.auth())

// Public pages (must be last to avoid conflicts)
router.get('/:slug', [PublicPagesController, 'show']).as('public.page')

