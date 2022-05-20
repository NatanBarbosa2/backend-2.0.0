import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Company from 'App/Models/Company'
import Group from 'App/Models/Group'
import Staff from 'App/Models/Staff'
import Store from 'App/Validators/Group/StoreValidator'
import Update from 'App/Validators/Group/Validator'

export default class GroupsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { name } = await request.validate(Store)
    const companyId = request.param('companyId')

    const company = await Company.findOrFail(companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const group = await company.related('group').create({ name })
    response.created({ response: group })
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const { id, companyId, type } = request.params()
    const company = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    if (type === 'all') {
      const groups = await Group.query()
        .where('company_id', companyId)
        .preload('members')
        .preload('quests')
      return response.accepted({ response: groups })
    }

    const groups = await Group.query().where('id', id).preload('members')
    return response.accepted({ response: groups })
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const { id, companyId } = request.params()
    const { name } = await request.validate(Update)

    const company = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    await Group.findOrFail(id)
    const group = await company.related('group').updateOrCreate({ id }, { name })
    response.accepted({ response: group })
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id, companyId } = request.params()

    const company = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const group = await Group.findOrFail(id)
    await group.delete()

    response.noContent()
  }

  private async verifyIfUserIdIsAStaffMember(userId: number, company: Company) {
    if (company.userId === userId) return true
    else {
      const [com] = await Staff.query()
        .where('member_id', userId)
        .andWhere('company_id', company.id)
      if (com) return true
      else return false
    }
  }
}
