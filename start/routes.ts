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
  })
  .use(middleware.auth())

