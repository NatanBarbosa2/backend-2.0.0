import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Data extends BaseSchema {
  protected tableName = 'data'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('adverts')
      table.integer('calls')
      table.integer('schedules')
      table.integer('attendances')
      table.integer('salers')
      table.integer('amount_of_money')
      table.integer('member_id').unsigned().references('members.id').onDelete('CASCADE')
      table.integer('company_id')

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
