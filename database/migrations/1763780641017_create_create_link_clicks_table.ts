import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'link_clicks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid('id')
        .primary()
        .defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table
        .uuid('link_id')
        .notNullable()
        .references('id')
        .inTable('links')
        .onDelete('CASCADE')
      table
        .uuid('user_id')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      // Click details
      table.string('ip_address', 45).nullable() // IPv6 max length
      table.string('user_agent', 500).nullable()
      table.string('referrer', 500).nullable()
      table.string('country', 2).nullable() // ISO country code
      table.string('city', 100).nullable()
      table.string('device_type', 50).nullable() // mobile, tablet, desktop
      table.string('browser', 100).nullable()
      table.string('os', 100).nullable()

      table
        .timestamp('clicked_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())
      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())
      table
        .timestamp('updated_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())

      // Indexes for analytics queries
      table.index(['link_id', 'clicked_at'])
      table.index(['user_id', 'clicked_at'])
      table.index('clicked_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
