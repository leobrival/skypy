import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import Link from '#models/link'
import UtmPreset from '#models/utm_preset'
import {
  createShortLinkValidator,
  updateShortLinkValidator,
} from '#validators/short_link_validator'

export default class LinksController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    // Fetch user's shortened links (where landingPageId is null = standalone short links)
    const links = await Link.query()
      .where('user_id', user.id)
      .whereNull('landing_page_id')
      .orderBy('created_at', 'desc')

    return inertia.render('links/index', {
      links: links.map((link) => ({
        id: link.id,
        title: link.title,
        shortCode: link.shortCode,
        destinationUrl: link.destinationUrl,
        clickCount: link.clickCount,
        isActive: link.isActive,
        createdAt: link.createdAt.toFormat('yyyy-MM-dd HH:mm'),
        utmSource: link.utmSource,
        utmMedium: link.utmMedium,
        utmCampaign: link.utmCampaign,
        utmTerm: link.utmTerm,
        utmContent: link.utmContent,
      })),
      user: {
        id: user.id,
        username: user.username,
      },
    })
  }

  async create({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const presets = await UtmPreset.query()
      .where('user_id', user.id)
      .orderBy('is_default', 'desc')
      .orderBy('name', 'asc')

    return inertia.render('links/create', {
      user: {
        id: user.id,
        username: user.username,
      },
      presets: presets.map((preset) => ({
        id: preset.id,
        name: preset.name,
        utmSource: preset.utmSource,
        utmMedium: preset.utmMedium,
        utmCampaign: preset.utmCampaign,
        utmTerm: preset.utmTerm,
        utmContent: preset.utmContent,
        isDefault: preset.isDefault,
      })),
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createShortLinkValidator)

    // Generate short code if not provided
    const shortCode = data.shortCode || nanoid(8)

    // Check if short code already exists
    const existingLink = await Link.findBy('short_code', shortCode)
    if (existingLink) {
      return response.badRequest({ error: 'This short code is already taken' })
    }

    await Link.create({
      userId: user.id,
      landingPageId: null, // Standalone short link
      title: data.title,
      destinationUrl: data.destinationUrl,
      shortCode,
      expirationDate: data.expirationDate
        ? DateTime.fromJSDate(data.expirationDate)
        : null,
      clickCount: 0,
      position: 0,
      isActive: true,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmTerm: data.utmTerm,
      utmContent: data.utmContent,
      customParams: data.customParams || null,
    })

    return response.redirect('/links')
  }

  async edit({ auth, params, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const link = await Link.find(params.id)

    if (!link || link.userId !== user.id) {
      return response.notFound()
    }

    const presets = await UtmPreset.query()
      .where('user_id', user.id)
      .orderBy('is_default', 'desc')
      .orderBy('name', 'asc')

    return inertia.render('links/edit', {
      link: {
        id: link.id,
        title: link.title,
        destinationUrl: link.destinationUrl,
        shortCode: link.shortCode,
        isActive: link.isActive,
        clickCount: link.clickCount,
        utmSource: link.utmSource,
        utmMedium: link.utmMedium,
        utmCampaign: link.utmCampaign,
        utmTerm: link.utmTerm,
        utmContent: link.utmContent,
        customParams: link.customParams || [],
      },
      presets: presets.map((preset) => ({
        id: preset.id,
        name: preset.name,
        utmSource: preset.utmSource,
        utmMedium: preset.utmMedium,
        utmCampaign: preset.utmCampaign,
        utmTerm: preset.utmTerm,
        utmContent: preset.utmContent,
        isDefault: preset.isDefault,
      })),
      user: {
        id: user.id,
        username: user.username,
      },
    })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const link = await Link.find(params.id)

    if (!link || link.userId !== user.id) {
      return response.notFound()
    }

    const data = await request.validateUsing(updateShortLinkValidator)

    link.merge(data)
    await link.save()

    return response.redirect('/links')
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const link = await Link.find(params.id)

    if (!link || link.userId !== user.id) {
      return response.notFound()
    }

    await link.delete()

    return response.redirect('/links')
  }
}
