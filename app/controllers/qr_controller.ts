import type { HttpContext } from '@adonisjs/core/http'

export default class QrController {
  async generate({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    return inertia.render('qr/generate', {
      user: {
        id: user.id,
        username: user.username,
      },
    })
  }
}
