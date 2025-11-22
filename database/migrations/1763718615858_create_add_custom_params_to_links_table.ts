import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // JSON field to store custom URL parameters beyond UTM
      // Format: [{ key: 'ref', value: 'partner123' }, { key: 'affiliate_id', value: '456' }]
      table.jsonb('custom_params').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('custom_params')
    })
  }
}
