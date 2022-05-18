import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'

export default class SaleCompany extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'number_of_days_worked' })
  public numberOfDaysWorked: number

  @column({ columnName: 'number_of_ads_per_day' })
  public numberOfAdsPerDay: number

  @column({ columnName: 'number_of_calls_per_day' })
  public numberOfCallsPerDay: number

  @column({ columnName: 'number_of_scheduling_per_day' })
  public numberOfSchedulingPerDay: number

  @column({ columnName: 'number_of_attendance_per_day' })
  public numberOfAttendancePerDay: number

  @column({ columnName: 'is_closed' })
  public isClosed: Boolean

  @column({ columnName: 'company_id' })
  public companyId: number

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
