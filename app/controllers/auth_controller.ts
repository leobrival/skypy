import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth_validator'

export default class AuthController {
  /**
   * Show registration form
   */
  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Handle user registration
   */
  async register({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      email: data.email,
      username: data.username,
      passwordHash: data.password,
      accountTier: 'free',
    })

    await auth.use('web').login(user)

    // Redirect new users to onboarding
    return response.redirect('/onboarding/step1')
  }

  /**
   * Show login form
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Handle user login
   */
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    // Redirect to onboarding if not completed, otherwise dashboard
    if (!user.onboardingCompleted) {
      return response.redirect('/onboarding/step1')
    }
    return response.redirect('/dashboard')
  }

  /**
   * Handle user logout
   */
  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
