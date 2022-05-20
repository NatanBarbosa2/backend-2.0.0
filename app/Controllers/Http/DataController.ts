import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Member from 'App/Models/Member'
import Store from 'App/Validators/Data/StoreValidator'

export default class DataController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { adverts, calls, schedules, attendances, salers, amountOfMoney } =
      await request.validate(Store)
    const member = await Member.findByOrFail('email', auth.user!.email)
    console.log(member)
    const datum = await Member.query().preload('datas')

    if (!(datum.length >= 0)) {
      const lastData = datum.pop()!.createdAt.diffNow().milliseconds
      if (lastData <= -86400000) {
        const data = await member.related('datas').create({
          adverts,
          calls,
          schedules,
          attendances,
          salers,
          amountOfMoney,
          companyId: member.companyId,
        })

        await data.save()
        console.log(data)
        return response.created({ response: data })
      }
      return response.abort({ response: 'Usuario já cadastrou hoje' })
    } else {
      const data = await member.related('datas').create({
        adverts,
        calls,
        schedules,
        attendances,
        salers,
        amountOfMoney,
      })

      response.created({ response: data })
    }
  }
}
