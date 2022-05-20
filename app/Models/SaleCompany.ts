import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'
import Group from './Group'

export default class SaleCompany extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ columnName: 'number_of_days_worked' })
  public numberOfDaysWorked: DateTime

  @column({ columnName: 'number_of_ads_per_day' })
  public numberOfAdsPerDay: number

  @column({ columnName: 'number_of_sallers' })
  public numberOfSallers: number

  @column({ columnName: 'number_of_calls_per_day' })
  public numberOfCallsPerDay: number

  @column({ columnName: 'number_of_scheduling_per_day' })
  public numberOfSchedulingPerDay: number

  @column({ columnName: 'number_of_attendance_per_day' })
  public numberOfAttendancePerDay: number

  @column({ columnName: 'amount_of_money' })
  public amountOfMoney: number

  @column({ columnName: 'is_closed' })
  public isClosed: number

  @column({ columnName: 'company_id' })
  public companyId: number

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @manyToMany(() => Group, {
    pivotTable: 'group_quests',
    localKey: 'id',
    pivotForeignKey: 'quest_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'group_id',
  })
  public groups: ManyToMany<typeof Group>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
