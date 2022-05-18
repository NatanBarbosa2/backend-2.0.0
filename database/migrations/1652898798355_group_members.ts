import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GroupMembers extends BaseSchema {
  protected tableName = 'group_members'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('member_id').unsigned().references('members.id')
      table.integer('group_id').unsigned().references('groups.id')
      table.unique(['member_id', 'group_id'])
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
