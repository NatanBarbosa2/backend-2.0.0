import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Validators/Sessions/StoreValidator'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(Store)

    const token = await auth.attempt(email, password, {
      expiresIn: '2hours',
    })

    return response.created({ response: { user: auth.user, token } })
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.logout()

    return response.ok({})
  }
}
