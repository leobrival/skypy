import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('email', 255).notNullable().unique()
      table.string('username', 50).notNullable().unique()
      table.string('password_hash', 255).nullable()
      table.string('profile_image_url', 500).nullable()
      table.enum('account_tier', ['free', 'premium']).defaultTo('free')
      table.timestamp('email_verified_at').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
