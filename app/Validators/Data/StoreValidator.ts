import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    adverts: schema.number([]),
    calls: schema.number([]),
    schedules: schema.number([]),
    attendances: schema.number([]),
    salers: schema.number([]),
    amountOfMoney: schema.number([]),
  })

  public messages = {
    '*.required': 'Este campo é obrigatorio',
  }
}
