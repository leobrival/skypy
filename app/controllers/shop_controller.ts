import type { HttpContext } from '@adonisjs/core/http'

export default class ShopController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    // TODO: Fetch products from database
    const products: any[] = []

    return inertia.render('shop/index', {
      products,
      user: {
        id: user.id,
        username: user.username,
        accountTier: user.accountTier,
      },
    })
  }
}
