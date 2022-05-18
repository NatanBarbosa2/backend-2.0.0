import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string({}, []),
    profileImage: schema.file.optional(
      {
        size: '2mb',
        extnames: ['jpg', 'png', 'gif'],
      },
      []
    ),
  })

  public messages = {}
}
