import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({}, []),
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    password: schema.string({}, []),
    profileImage: schema.file.optional(
      {
        size: '2mb',
        extnames: ['jpg', 'png', 'gif'],
      },
      []
    ),
    phoneNumber: schema.string.optional([rules.mobile()]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'name.required': 'O nome é obrigatorio',
    'email.required': 'O email é obrigatorio',
    'email.email': 'O email é inválido',
    'email.unique': 'O email já existe',
    'password.required': 'A senha é obrigatoria',
    'profileImage.file.extname': 'Formato inválido',
    'phoneNumber.mobile': 'Celular inválido',
  }
}
