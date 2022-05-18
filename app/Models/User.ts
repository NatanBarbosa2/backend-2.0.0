import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Company from './Company'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({})
  public email: string

  @column({})
  public password: string

  @column({ columnName: 'phone_number' })
  public phoneNumber: string | undefined

  @column({ columnName: 'profile_image' })
  public profileImage: any

  @hasMany(() => Company)
  public companies: HasMany<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
