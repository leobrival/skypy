import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import Link from '#models/link'
import User from '#models/user'

export default class LinkClick extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'link_id' })
  declare linkId: string

  @column({ columnName: 'user_id' })
  declare userId: string | null

  // Click details
  @column({ columnName: 'ip_address' })
  declare ipAddress: string | null

  @column({ columnName: 'user_agent' })
  declare userAgent: string | null

  @column()
  declare referrer: string | null

  @column()
  declare country: string | null

  @column()
  declare city: string | null

  @column({ columnName: 'device_type' })
  declare deviceType: string | null

  @column()
  declare browser: string | null

  @column()
  declare os: string | null

  @column.dateTime({ columnName: 'clicked_at' })
  declare clickedAt: DateTime

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Link)
  declare link: BelongsTo<typeof Link>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
