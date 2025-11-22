import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('utm_source', 255).nullable()
      table.string('utm_medium', 255).nullable()
      table.string('utm_campaign', 255).nullable()
      table.string('utm_term', 255).nullable()
      table.string('utm_content', 255).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('utm_source')
      table.dropColumn('utm_medium')
      table.dropColumn('utm_campaign')
      table.dropColumn('utm_term')
      table.dropColumn('utm_content')
    })
  }
}
