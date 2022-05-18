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

export default class Member extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({})
  public email: string

  @column({})
  public password: string

  @column({})
  public type: string

  @column({})
  public group: string

  @column({ columnName: 'phone_number' })
  public phoneNumber: string | undefined

  @column({ columnName: 'profile_image' })
  public profileImage: any

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @column({ columnName: 'company_id' })
  public companyId: number

  @manyToMany(() => Group, {
    pivotTable: 'group_members',
    localKey: 'id',
    pivotForeignKey: 'member_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'group_id',
  })
  public groups: ManyToMany<typeof Group>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
