import type { HttpContext } from '@adonisjs/core/http'
import LandingPage from '#models/landing_page'

export default class PublicPagesController {
  /**
   * Show public landing page by slug
   */
  async show({ params, inertia, response }: HttpContext) {
    const page = await LandingPage.query()
      .where('slug', params.slug)
      .where('visibility', 'public')
      .preload('links', (query) => {
        query.where('isActive', true).orderBy('position', 'asc')
      })
      .first()

    if (!page) {
      return response.notFound('Page not found')
    }

    // Increment view count (fire and forget)
    page.viewCount += 1
    page.save().catch(() => {})

    return inertia.render('public/landing_page', {
      page: {
        slug: page.slug,
        profileName: page.profileName,
        bio: page.bio,
        themeConfig: page.themeConfig || {},
        links: page.links.map((link) => ({
          id: link.id,
          title: link.title,
          description: link.description,
          destinationUrl: link.destinationUrl,
          shortCode: link.shortCode,
        })),
      },
    })
  }
}
