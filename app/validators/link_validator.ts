import vine from '@vinejs/vine'

export const createLinkValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(200),
    description: vine.string().maxLength(500).optional(),
    destinationUrl: vine.string().url().maxLength(2048),
    landingPageId: vine.string().uuid().optional(),
    expirationDate: vine.date().optional(),
  })
)

export const updateLinkValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(200).optional(),
    description: vine.string().maxLength(500).optional(),
    destinationUrl: vine.string().url().maxLength(2048).optional(),
    position: vine.number().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const reorderLinksValidator = vine.compile(
  vine.object({
    links: vine.array(
      vine.object({
        id: vine.string().uuid(),
        position: vine.number(),
      })
    ),
  })
)
