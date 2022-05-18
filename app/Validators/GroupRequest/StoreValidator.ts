import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.exists({
        table: 'members',
        column: 'email',
        where: { company_id: this.ctx.request.param('companyId') },
      }),
    ]),
    groupName: schema.string({}, [
      rules.exists({
        table: 'groups',
        column: 'name',
        where: { company_id: this.ctx.request.param('companyId') },
      }),
    ]),
  })

  public messages = {
    'groupName.exists': `Não existe Grupo com esse nome na Empresa com id: ${this.ctx.request.param(
      'companyId'
    )}`,
    'email.exists': `Não existe Membro com esse email na Empresa com id: ${this.ctx.request.param(
      'companyId'
    )}`,
  }

  // * {
  // *   'profile.username.required': 'Username is required',
  // *   'scores.*.number': 'Define scores as valid numbers'
  // * }
  public handler() {
    console.log(this.ctx.request.param('companyId'))
  }
}
