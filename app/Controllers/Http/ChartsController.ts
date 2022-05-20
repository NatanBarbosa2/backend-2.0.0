import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Company from 'App/Models/Company'
import Datum from 'App/Models/Datum'
import Group from 'App/Models/Group'
import Member from 'App/Models/Member'
import SaleCompany from 'App/Models/SaleCompany'
import Staff from 'App/Models/Staff'

export default class ChartsController {
  public async showSaller({ request, auth, response }: HttpContextContract) {
    const questId = request.param('questId')
    const quest = await SaleCompany.findOrFail(questId)
    const company = await Company.findOrFail(quest.companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)

    const data: Datum[] = await Database.from('data')
      .where('created_at', '<', String(quest.numberOfDaysWorked))
      .andWhere('created_at', '>', String(quest.createdAt.toSQLDate()))

    if (!isStaff) {
      const member = await Member.findByOrFail('email', auth.user!.email)

      const userData = data.filter((el) => el['member_id'] === member.id)
      const values: number[][] = []
      userData.forEach((el) =>
        values.push([
          el['member_id'],
          el.adverts,
          el.schedules,
          el['amount_of_money'],
          el.salers,
          el.calls,
          el.attendances,
        ])
      )

      const result = this.calcDatas(values)
      return response.ok({ result })
    }

    const values: number[][] = []
    data.forEach((el) =>
      values.push([
        el['member_id'],
        el.adverts,
        el.schedules,
        el['amount_of_money'],
        el.salers,
        el.calls,
        el.attendances,
      ])
    )

    const result = this.calcDatas(values)
    return response.ok({ result })
  }

  public async showGroups({ request, auth, response }: HttpContextContract) {
    const questId = request.param('questId')
    const quest = await SaleCompany.findOrFail(questId)
    const company = await Company.findOrFail(quest.companyId)
    const isStaff = await this.verifyIfUserIdIsAStaffMember(auth.user!.id, company)

    const data: Datum[] = await Database.from('data')
      .where('created_at', '<', String(quest.numberOfDaysWorked))
      .andWhere('created_at', '>', String(quest.createdAt.toSQLDate()))

    if (!isStaff) {
      const membersList = await Member.query().where('email', auth.user!.email).preload('groups')
      const [userGroups] = membersList.filter((el) => el.groups).map((el) => el.groups)
      const idsGroups = userGroups.map((el) => el.toJSON().id)
      const valuesGroups: any = []
      const membersId: any = []

      for (let i in idsGroups) {
        const a = await Group.query().where('id', idsGroups[i]).preload('members')
        valuesGroups.push(a)
        membersId.push(a.map((el) => el.members.map((el2) => el2.id)).flat(1))
      }

      data.filter((el) => el['member_id'])
      const searchMemberOfGroup = await Member.query().preload('groups')

      // const userData = data.filter((el) => el['member_id'] === member.id)
      // const values: number[][] = []
      // searchMemberOfGroup.forEach((el) =>
      //   values.push([
      //     el['member_id'],
      //     el.adverts,
      //     el.schedules,
      //     el['amount_of_money'],
      //     el.salers,
      //     el.calls,
      //     el.attendances,
      //   ])
      // )

      // const result = this.calcDatas(values)
      return response.ok({ response: membersId })
    }

    const values: number[][] = []
    data.forEach((el) =>
      values.push([
        el['member_id'],
        el.adverts,
        el.schedules,
        el['amount_of_money'],
        el.salers,
        el.calls,
        el.attendances,
      ])
    )

    const result = this.calcDatas(values)
    return response.ok({ result })
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

  private calcDatas(values: number[][]) {
    const grouped = {}

    values.forEach((value) => {
      if (grouped[value[0]]) {
        grouped[value[0]].push(value)
      } else {
        grouped[value[0]] = [value]
      }
    })

    const sumArray = (array) => {
      const newArray: any = []
      array.forEach((sub) => {
        sub.shift()
        sub.forEach((num, index) => {
          if (newArray[index]) {
            newArray[index] += num
          } else {
            newArray[index] = num
          }
        })
      })
      return newArray
    }

    return Object.keys(grouped).map((key) => {
      return [Number(key), ...sumArray(grouped[key])]
    })
  }
}
