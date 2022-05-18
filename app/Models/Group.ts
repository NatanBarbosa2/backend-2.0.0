import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Member from './Member'
import Company from './Company'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({ columnName: 'company_id' })
  public companyId: number

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @manyToMany(() => Member, {
    pivotTable: 'group_members',
    localKey: 'id',
    pivotForeignKey: 'group_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'member_id',
  })
  public members: ManyToMany<typeof Member>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
