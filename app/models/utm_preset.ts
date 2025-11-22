import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import User from '#models/user'

export default class UtmPreset extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column()
  declare name: string

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

  @column({ columnName: 'is_default' })
  declare isDefault: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
