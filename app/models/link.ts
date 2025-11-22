import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import LandingPage from '#models/landing_page'
import LinkClick from '#models/link_click'
import User from '#models/user'

export default class Link extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column({ columnName: 'landing_page_id' })
  declare landingPageId: string | null

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column({ columnName: 'destination_url' })
  declare destinationUrl: string

  @column({ columnName: 'short_code' })
  declare shortCode: string

  @column.dateTime({ columnName: 'expiration_date' })
  declare expirationDate: DateTime | null

  @column({ columnName: 'click_count' })
  declare clickCount: number

  @column()
  declare position: number

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'utm_source' })
  declare utmSource: string | null

  @column({ columnName: 'utm_medium' })
  declare utmMedium: string | null

  @column({ columnName: 'utm_campaign' })
  declare utmCampaign: string | null

  @column({ columnName: 'utm_term' })
  declare utmTerm: string | null

  @column({ columnName: 'utm_content' })
  declare utmContent: string | null

  @column({ columnName: 'custom_params' })
  declare customParams: { key: string; value: string }[] | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => LandingPage, { foreignKey: 'landingPageId' })
  declare landingPage: BelongsTo<typeof LandingPage>

  @hasMany(() => LinkClick)
  declare clicks: HasMany<typeof LinkClick>
}
