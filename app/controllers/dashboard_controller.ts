import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    return inertia.render('dashboard/index', {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        accountTier: user.accountTier,
      },
    })
  }
}
