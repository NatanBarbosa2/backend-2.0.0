import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Members extends BaseSchema {
  protected tableName = 'members'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.string('email')
      table.string('password')
      table.enum('type', ['gestor', 'supervisor', 'vendedor']).defaultTo('vendedor')
      table.string('group')
      table.string('phone_number')
      table.string('profile_image')
      table.integer('company_id').unsigned().references('companies.id').onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
