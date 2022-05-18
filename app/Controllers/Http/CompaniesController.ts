import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Company from 'App/Models/Company'
import Store from 'App/Validators/Company/StoreValidator'

import { UserImageTypes } from '../@types/User/ImageTypes'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import User from 'App/Models/User'
import Update from 'App/Validators/Company/UpdateValidator'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Staff from 'App/Models/Staff'

export default class CompaniesController {
  public async store({ response, request, auth }: HttpContextContract) {
    const { name, profileImage } = await request.validate(Store)
    const company = await auth.user!.related('companies').create({ name })

    if (profileImage) await this.saveImage(request.file('profileImage'), company)
    response.created({ response: company })
  }

  public async show({ response, auth }: HttpContextContract) {
    const [userQuery] = await User.query().preload('companies', (QueryComp) => {
      QueryComp.where('user_id', auth.user!.id)
    })

    response.accepted({ response: userQuery.companies })
  }

  public async update({ response, request, auth }: HttpContextContract) {
    const body = await request.validate(Update)
    const id = request.param('id')
    const company = await Company.findOrFail(id)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const isUpdate = await this.saveAtt(body, { request, auth }, company)

    if (!isUpdate) throw new BadRequestException('Acesso negado para fazer essa alteração')

    await company.refresh()

    response.accepted({ response: company })
  }

  public async destroy({ response, request, auth }: HttpContextContract) {
    const id = request.param('id')
    const deleteCompany = await Company.findOrFail(id)

    const [companies] = await Company.query().where('id', id).preload('staff')
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, companies)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    await deleteCompany.delete()

    response.noContent()
  }

  private async saveImage(image: any, company: Company) {
    const clientImage: UserImageTypes = image
    clientImage.clientName = `${cuid()}.${clientImage.extname}`
    await clientImage.move(Application.tmpPath('uploads'))

    company.profileImage = clientImage.clientName
    await company.save()
  }

  private async saveAtt(
    { name, profileImage },
    { auth, request },
    company: Company
  ): Promise<Boolean> {
    if (auth.user!.id === company.userId) {
      if (name) company.name = name
      if (profileImage) await this.saveImage(request.file('profileImage'), company)

      await company.save()
      return true
    } else {
      const [companyQuery] = await User.query().preload('companies', (QueryComp) => {
        QueryComp.where('id', company.id).preload('staff')
      })

      const isStaff = companyQuery.companies.find((el) => el)

      if (isStaff) return true
      else return false
    }
  }

  private async verifyIfUserIdIsAStaffMember(userId: number, company: Company) {
    if (company.userId === userId) return true
    else {
      const [com] = await Staff.query().where('member_id', userId)
      if (com) return true
      else return false
    }
  }
}
