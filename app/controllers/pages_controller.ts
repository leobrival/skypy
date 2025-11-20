import type { HttpContext } from '@adonisjs/core/http'
import LandingPage from '#models/landing_page'
import Link from '#models/link'
import LinkShortenerService from '#services/link_shortener_service'
import {
  createPageValidator,
  updatePageValidator,
} from '#validators/page_validator'
import {
  createLinkValidator,
  updateLinkValidator,
  reorderLinksValidator,
} from '#validators/link_validator'

export default class PagesController {
  private linkShortenerService = new LinkShortenerService()

  /**
   * List all landing pages for authenticated user
   */
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const pages = await LandingPage.query()
      .where('userId', user.id)
      .preload('links')
      .orderBy('createdAt', 'desc')

    return inertia.render('pages/index', {
      pages: pages.map((page) => page.serialize()),
    })
  }

  /**
   * Show create page form
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('pages/create')
  }

  /**
   * Store a new landing page
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createPageValidator)

    const page = await LandingPage.create({
      userId: user.id,
      slug: data.slug,
      profileName: data.profileName,
      bio: data.bio,
      visibility: 'public',
      viewCount: 0,
    })

    return response.redirect(`/pages/${page.id}/edit`)
  }

  /**
   * Show a single landing page (for editing)
   */
  async show({ auth, params, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = await LandingPage.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('links', (query) => {
        query.orderBy('position', 'asc')
      })
      .firstOrFail()

    return inertia.render('pages/show', {
      page: page.serialize(),
    })
  }

  /**
   * Show edit form
   */
  async edit({ auth, params, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = await LandingPage.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('links', (query) => {
        query.orderBy('position', 'asc')
      })
      .firstOrFail()

    return inertia.render('pages/edit', {
      page: page.serialize(),
    })
  }

  /**
   * Update landing page
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = await LandingPage.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const data = await request.validateUsing(updatePageValidator)

    page.merge(data)
    await page.save()

    return response.redirect().back()
  }

  /**
   * Delete landing page
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = await LandingPage.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await page.delete()

    return response.redirect('/pages')
  }

  /**
   * Add a link to landing page
   */
  async addLink({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = await LandingPage.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const data = await request.validateUsing(createLinkValidator)

    // Get next position
    const maxPosition = await Link.query()
      .where('landingPageId', page.id)
      .max('position as maxPosition')
      .first()

    const nextPosition = (maxPosition?.$extras.maxPosition || 0) + 1

    // Generate short code
    const shortCode = await this.linkShortenerService.generateShortCode()

    const link = await Link.create({
      userId: user.id,
      landingPageId: page.id,
      title: data.title,
      description: data.description,
      destinationUrl: data.destinationUrl,
      shortCode,
      position: nextPosition,
      isActive: true,
      clickCount: 0,
    })

    return response.json(link.serialize())
  }

  /**
   * Update a link
   */
  async updateLink({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const link = await Link.query()
      .where('id', params.linkId)
      .where('userId', user.id)
      .firstOrFail()

    const data = await request.validateUsing(updateLinkValidator)

    link.merge(data)
    await link.save()

    return response.json(link.serialize())
  }

  /**
   * Remove a link
   */
  async removeLink({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const link = await Link.query()
      .where('id', params.linkId)
      .where('userId', user.id)
      .firstOrFail()

    await link.delete()

    return response.json({ success: true })
  }

  /**
   * Reorder links
   */
  async reorderLinks({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = await LandingPage.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const data = await request.validateUsing(reorderLinksValidator)

    // Update positions
    for (const item of data.links) {
      await Link.query()
        .where('id', item.id)
        .where('userId', user.id)
        .where('landingPageId', page.id)
        .update({ position: item.position })
    }

    return response.json({ success: true })
  }
}
