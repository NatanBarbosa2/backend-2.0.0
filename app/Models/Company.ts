import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Staff from './Staff'
import User from './User'
import Member from './Member'
import Group from './Group'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({ columnName: 'profile_image' })
  public profileImage: any

  @hasMany(() => Staff)
  public staff: HasMany<typeof Staff>

  @hasMany(() => Member)
  public member: HasMany<typeof Member>

  @hasMany(() => Group)
  public group: HasMany<typeof Group>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column({ columnName: 'user_id' })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
