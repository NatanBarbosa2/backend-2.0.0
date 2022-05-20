import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SaleCompanies extends BaseSchema {
  protected tableName = 'sale_companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.integer('number_of_days_worked')
      table.integer('number_of_ads_per_day')
      table.integer('number_of_sallers')
      table.integer('number_of_calls_per_day')
      table.integer('number_of_scheduling_per_day')
      table.integer('number_of_attendance_per_day')
      table.integer('amount_of_money')
      table.boolean('is_closed')
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
