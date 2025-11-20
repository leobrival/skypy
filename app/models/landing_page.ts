import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Link from '#models/link'

interface ThemeConfig {
  backgroundColor?: string
  textColor?: string
  buttonStyle?: 'rounded' | 'square' | 'pill'
  fontFamily?: string
  customCss?: string
}

export default class LandingPage extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column()
  declare slug: string

  @column({ columnName: 'profile_name' })
  declare profileName: string

  @column()
  declare bio: string | null

  @column({
    columnName: 'theme_config',
    prepare: (value: ThemeConfig | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare themeConfig: ThemeConfig | null

  @column()
  declare visibility: 'public' | 'private'

  @column({ columnName: 'view_count' })
  declare viewCount: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Link, { foreignKey: 'landingPageId' })
  declare links: HasMany<typeof Link>
}
