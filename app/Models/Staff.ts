import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'
import Member from './Member'

export default class Staff extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'company_id' })
  public companyId: number

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @column({ columnName: 'member_id' })
  public memberId: number

  @belongsTo(() => Member)
  public member: BelongsTo<typeof Member>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
