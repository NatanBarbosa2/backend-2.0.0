import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Company from 'App/Models/Company'
import Group from 'App/Models/Group'
import Member from 'App/Models/Member'
import Staff from 'App/Models/Staff'
import StoreValidator from 'App/Validators/GroupRequest/StoreValidator'

export default class GroupsRequestsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const id = request.param('companyId')
    const { email, groupName } = await request.validate(StoreValidator)
    const company = await Company.findOrFail(id)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const group = await Group.findByOrFail('name', groupName)
    const member = await Member.findByOrFail('email', email)
    const relation = await group.related('members').create(member)

    response.accepted({ response: relation })
  }

  public async show({ request, auth, response }: HttpContextContract) {
    const { id, companyId, type } = request.params()

    const companyExists = await Company.findOrFail(companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, companyExists)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    if (type === 'all') {
      const groups = await Group.query().where('company_id', companyId).preload('members')

      return response.accepted({ response: groups })
    }

    const [groups] = await Group.query().where('id', id).preload('members')

    response.accepted({ response: groups })
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { id, groupId, companyId, type } = request.params()

    const company = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    if (type === 'all') {
      await Group.query().where('company_id', companyId).andWhere('id', groupId).delete()
      return response.noContent()
    }

    // await Group.query()
    //   .where('id', groupId)
    //   .andWhere('company_id', companyId)
    //   .preload('members', (query) => query.where('id', id)
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
