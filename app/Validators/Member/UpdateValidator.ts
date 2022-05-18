import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string({}, []),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, []),
    type: schema.string({}),
    group: schema.string({}),
    profileImage: schema.file.optional(
      {
        size: '2mb',
        extnames: ['jpg', 'png', 'gif'],
      },
      []
    ),
    phoneNumber: schema.string.optional([rules.mobile()]),
  })

  public messages = {}
}
