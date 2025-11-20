import vine from '@vinejs/vine'

export const createPageValidator = vine.compile(
  vine.object({
    slug: vine
      .string()
      .minLength(3)
      .maxLength(100)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .unique(async (db, value) => {
        const page = await db.from('landing_pages').where('slug', value).first()
        return !page
      }),
    profileName: vine.string().minLength(1).maxLength(200),
    bio: vine.string().maxLength(500).optional(),
  })
)

export const updatePageValidator = vine.compile(
  vine.object({
    slug: vine
      .string()
      .minLength(3)
      .maxLength(100)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .optional(),
    profileName: vine.string().minLength(1).maxLength(200).optional(),
    bio: vine.string().maxLength(500).optional(),
    themeConfig: vine
      .object({
        backgroundColor: vine.string().optional(),
        textColor: vine.string().optional(),
        buttonStyle: vine.enum(['rounded', 'square', 'pill']).optional(),
        fontFamily: vine.string().optional(),
        customCss: vine.string().maxLength(10000).optional(),
      })
      .optional(),
    visibility: vine.enum(['public', 'private']).optional(),
  })
)
