import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import LandingPage from '#models/landing_page'
import Link from '#models/link'

// import Product from '#models/product' // TODO: Uncomment when implementing Phase 6 (E-commerce)

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'passwordHash',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column()
  declare username: string

  @column({ serializeAs: null, columnName: 'password_hash' })
  declare passwordHash: string | null

  @column({ columnName: 'profile_image_url' })
  declare profileImageUrl: string | null

  @column({ columnName: 'account_tier' })
  declare accountTier: 'free' | 'premium'

  @column.dateTime({ columnName: 'email_verified_at' })
  declare emailVerifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  declare updatedAt: DateTime

  // Relationships
  @hasMany(() => LandingPage)
  declare landingPages: HasMany<typeof LandingPage>

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  // TODO: Uncomment when implementing Phase 6 (E-commerce)
  // @hasMany(() => Product, { foreignKey: 'sellerId' })
  // declare products: HasMany<typeof Product>
}
