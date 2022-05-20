import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Company from 'App/Models/Company'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import StoreValidator from 'App/Validators/Member/StoreValidator'
import { UserImageTypes } from '../@types/User/ImageTypes'
import Member from 'App/Models/Member'
import Update from 'App/Validators/Member/UpdateValidator'
import Staff from 'App/Models/Staff'
import Group from 'App/Models/Group'
import SaleCompany from 'App/Models/SaleCompany'

export default class MembersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const id = request.param('companyId')
    const { email, name, password, type, group, salesCompany } = await request.validate(
      StoreValidator
    )

    const company = await Company.findOrFail(id)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const member = await company.related('member').create({ email, name, password, type, group })
    if (request.file('profileImage')) await this.saveImage(request.file('profileImage'), email)
    if (type === 'gestor' || type === 'gerente' || type === 'supervisor')
      await this.createStaff(id, member)

    let groupExists = await Group.findBy('name', group)

    if (!groupExists) {
      groupExists = await company.related('group').create({ name })
      await groupExists.related('members').create(member)
    } else {
      groupExists = await Group.findByOrFail('name', group)
      await groupExists.related('members').create(member)
    }

    const saleCompany = await SaleCompany.findByOrFail('name', salesCompany)
    await saleCompany.related('groups').create(groupExists!)

    await User.create({ email: member.email, name: member.name, password: member.password })
    response.created({ response: member })
  }

  public async show({ request, response, auth }: HttpContextContract) {
    const { id, companyId, type } = request.params()

    const companyExists = await Company.findOrFail(companyId)

    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, companyExists)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    if (type === 'all') {
      const [company] = await Company.query()
        .where('id', companyId)
        .preload('member', (QueryMember) => {
          QueryMember.preload('groups')
          QueryMember.preload('datas')
        })
      return response.accepted({ response: company.member })
    }

    const [company] = await Company.query()
      .where('id', companyId)
      .preload('member', (QueryMember) => QueryMember.where('id', id))

    response.accepted({ response: company.member })
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const { id, companyId } = request.params()
    const { email, name, password, type, group } = await request.validate(Update)

    const companyExists = await Company.findOrFail(companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, companyExists)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')

    const member = await Member.findOrFail(id)
    await User.findByOrFail('email', member.email)
    await Member.updateOrCreate({ id }, { email, name, password, type, group })
    await User.updateOrCreate(
      { email },
      {
        email: member.email,
        name: member.name,
        password: member.password,
        profileImage: member.profileImage,
      }
    )
    await member.refresh()
    if (request.file('profileImage')) await this.saveImage(request.file('profileImage'), email)
    response.accepted({ response: member })
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    const { id, companyId } = request.params()

    const companyExists = await Company.findOrFail(companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, companyExists)
    if (!isStaff) throw new BadRequestException('Acesso negado para fazer essa alteração')
    const member = await Member.findOrFail(id)
    await member.delete()

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

  private async createStaff(companyId: number, member: Member) {
    await Staff.create({ companyId, memberId: member.id })
  }

  private async saveImage(image: any, email: string) {
    const clientImage: UserImageTypes = image
    clientImage.clientName = `${cuid()}.${clientImage.extname}`
    await clientImage.move(Application.tmpPath('uploads/memberPics/'))

    await Member.updateOrCreate({ email }, { profileImage: clientImage.data.clientName })
  }
}
