import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import UtmPreset from '#models/utm_preset'

const createPresetValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(100),
    utmSource: vine.string().maxLength(255).optional(),
    utmMedium: vine.string().maxLength(255).optional(),
    utmCampaign: vine.string().maxLength(255).optional(),
    utmTerm: vine.string().maxLength(255).optional(),
    utmContent: vine.string().maxLength(255).optional(),
    isDefault: vine.boolean().optional(),
  }),
)

export default class UtmPresetsController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()

    const presets = await UtmPreset.query()
      .where('user_id', user.id)
      .orderBy('is_default', 'desc')
      .orderBy('name', 'asc')

    return inertia.render('utm-presets/index', {
      presets: presets.map((preset) => ({
        id: preset.id,
        name: preset.name,
        utmSource: preset.utmSource,
        utmMedium: preset.utmMedium,
        utmCampaign: preset.utmCampaign,
        utmTerm: preset.utmTerm,
        utmContent: preset.utmContent,
        isDefault: preset.isDefault,
        createdAt: preset.createdAt.toFormat('yyyy-MM-dd'),
      })),
      user: {
        id: user.id,
        username: user.username,
      },
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createPresetValidator)

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await UtmPreset.query()
        .where('user_id', user.id)
        .update({ isDefault: false })
    }

    await UtmPreset.create({
      userId: user.id,
      name: data.name,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
      isDefault: data.isDefault || false,
    })

    return response.redirect('/utm-presets')
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const preset = await UtmPreset.find(params.id)

    if (!preset || preset.userId !== user.id) {
      return response.notFound()
    }

    const data = await request.validateUsing(createPresetValidator)

    // If setting as default, unset other defaults
    if (data.isDefault && !preset.isDefault) {
      await UtmPreset.query()
        .where('user_id', user.id)
        .update({ isDefault: false })
    }

    preset.merge({
      name: data.name,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
      isDefault: data.isDefault || false,
    })
    await preset.save()

    return response.redirect('/utm-presets')
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const preset = await UtmPreset.find(params.id)

    if (!preset || preset.userId !== user.id) {
      return response.notFound()
    }

    await preset.delete()

    return response.redirect('/utm-presets')
  }

  // API endpoint to get presets for dropdowns
  async list({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const presets = await UtmPreset.query()
      .where('user_id', user.id)
      .orderBy('is_default', 'desc')
      .orderBy('name', 'asc')

    return response.json(
      presets.map((preset) => ({
        id: preset.id,
        name: preset.name,
        utmSource: preset.utmSource,
        utmMedium: preset.utmMedium,
        utmCampaign: preset.utmCampaign,
        utmTerm: preset.utmTerm,
        utmContent: preset.utmContent,
        isDefault: preset.isDefault,
      })),
    )
  }
}
