import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'link_clicks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add geolocation fields
      table.string('region', 100).nullable().after('city')
      table.string('country_code', 2).nullable().after('country')
      table.string('timezone', 50).nullable().after('region')
      table.decimal('latitude', 10, 7).nullable().after('timezone')
      table.decimal('longitude', 10, 7).nullable().after('latitude')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('region')
      table.dropColumn('country_code')
      table.dropColumn('timezone')
      table.dropColumn('latitude')
      table.dropColumn('longitude')
    })
  }
}
