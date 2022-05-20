import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Company from 'App/Models/Company'
import SaleCompany from 'App/Models/SaleCompany'
import Staff from 'App/Models/Staff'
import Store from 'App/Validators/SalesCompany/StoreValidator'

export default class SalesCompaniesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const {
      name,
      numberOfDaysWorked,
      numberOfAdsPerDay,
      numberOfSallers,
      numberOfCallsPerDay,
      numberOfSchedulingPerDay,
      numberOfAttendancePerDay,
      amountOfMoney,
    } = await request.validate(Store)
    const companyId = request.param('companyId')

    const company = await Company.findOrFail(companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const salesCompany = await company.related('sale_comapany').create({
      name,
      numberOfDaysWorked,
      numberOfAdsPerDay,
      numberOfSallers,
      numberOfCallsPerDay,
      numberOfSchedulingPerDay,
      numberOfAttendancePerDay,
      amountOfMoney,
    })
    response.created({ response: salesCompany })
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const { id, companyId, type } = request.params()
    const company = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    if (type === 'all') {
      const salesCompany = await SaleCompany.query()
        .where('company_id', companyId)
        .preload('groups')
      return response.accepted({ response: salesCompany })
    }

    const salesCompany = await SaleCompany.query().where('id', id).preload('groups')
    return response.accepted({ response: salesCompany })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id, companyId } = request.params()

    const company = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const salesCompany = await SaleCompany.findOrFail(id)
    await salesCompany.delete()

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
