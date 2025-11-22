import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    username: vine
      .string()
      .minLength(3)
      .maxLength(50)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .unique(async (db, value) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(255).confirmed(),
  }),
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
    remember: vine.boolean().optional(),
  }),
)
