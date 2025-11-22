import vine from '@vinejs/vine'

export const createShortLinkValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(255),
    destinationUrl: vine.string().url().maxLength(2048),
    shortCode: vine
      .string()
      .minLength(3)
      .maxLength(20)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .optional(),
    expirationDate: vine.date().optional(),
    utmSource: vine.string().minLength(1).maxLength(255).optional(),
    utmMedium: vine.string().minLength(1).maxLength(255).optional(),
    utmCampaign: vine.string().minLength(1).maxLength(255).optional(),
    utmTerm: vine.string().minLength(1).maxLength(255).optional(),
    utmContent: vine.string().minLength(1).maxLength(255).optional(),
    customParams: vine
      .array(
        vine.object({
          key: vine.string().minLength(1).maxLength(100),
          value: vine.string().minLength(1).maxLength(500),
        }),
      )
      .optional(),
  }),
)

export const updateShortLinkValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(255).optional(),
    destinationUrl: vine.string().url().maxLength(2048).optional(),
    isActive: vine.boolean().optional(),
    utmSource: vine.string().minLength(1).maxLength(255).optional(),
    utmMedium: vine.string().minLength(1).maxLength(255).optional(),
    utmCampaign: vine.string().minLength(1).maxLength(255).optional(),
    utmTerm: vine.string().minLength(1).maxLength(255).optional(),
    utmContent: vine.string().minLength(1).maxLength(255).optional(),
    customParams: vine
      .array(
        vine.object({
          key: vine.string().minLength(1).maxLength(100),
          value: vine.string().minLength(1).maxLength(500),
        }),
      )
      .optional(),
  }),
)
