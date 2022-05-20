import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Member from './Member'
import Company from './Company'

export default class Datum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public adverts: number

  @column()
  public calls: number

  @column()
  public schedules: number

  @column()
  public attendances: number

  @column()
  public salers: number

  @column({ columnName: 'amount_of_money' })
  public amountOfMoney: number

  @column({ columnName: 'member_id' })
  public memberId: number

  @belongsTo(() => Member)
  public member: BelongsTo<typeof Member>

  @column({ columnName: 'company_id' })
  public companyId: number

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
