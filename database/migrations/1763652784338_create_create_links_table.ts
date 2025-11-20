import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('landing_page_id').nullable().references('id').inTable('landing_pages').onDelete('SET NULL')
      table.string('title', 200).notNullable()
      table.text('description').nullable()
      table.string('destination_url', 2048).notNullable()
      table.string('short_code', 20).notNullable().unique()
      table.timestamp('expiration_date').nullable()
      table.integer('click_count').defaultTo(0)
      table.integer('position').defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())

      table.index('short_code')
      table.index('user_id')
      table.index('landing_page_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}