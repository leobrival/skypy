import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Step 1: About you
      table.string('display_name', 100).nullable()
      table.jsonb('use_cases').nullable() // Array of selected use cases

      // Step 2: Your work
      table.string('industry', 100).nullable()

      // Step 3: What to create first (stored for analytics)
      table.string('first_action', 50).nullable()

      // Onboarding completion tracking
      table.boolean('onboarding_completed').defaultTo(false)
      table.timestamp('onboarding_completed_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('display_name')
      table.dropColumn('use_cases')
      table.dropColumn('industry')
      table.dropColumn('first_action')
      table.dropColumn('onboarding_completed')
      table.dropColumn('onboarding_completed_at')
    })
  }
}
