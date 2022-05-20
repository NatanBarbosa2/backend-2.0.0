import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GroupQuests extends BaseSchema {
  protected tableName = 'group_quests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('quest_id').unsigned().references('sale_companies.id')
      table.integer('group_id').unsigned().references('groups.id')
      table.unique(['quest_id', 'group_id'])
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
