import { rules, schema } from '@ioc:Adonis/Core/Validator'
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
    name: schema.string({}, [
      rules.unique({
        table: 'sale_companies',
        column: 'name',
        where: {
          company_id: this.ctx.request.param('companyId'),
        },
      }),
    ]),
    numberOfDaysWorked: schema.date({}, [rules.after('today')]),
    numberOfAdsPerDay: schema.number([]),
    numberOfSallers: schema.number([]),
    numberOfCallsPerDay: schema.number([]),
    numberOfSchedulingPerDay: schema.number([]),
    numberOfAttendancePerDay: schema.number([]),
    amountOfMoney: schema.number([]),
  })

  public messages = {
    'name.unique': `Esta companha esta ativa na Empresa com id: ${this.ctx.request.param(
      'companyId'
    )}`,
    '*.required': 'Este campo é obrigatorio',
  }
}
