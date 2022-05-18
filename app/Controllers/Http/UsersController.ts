import User from 'App/Models/User'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserImageTypes } from '../@types/User/ImageTypes'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import Store from 'App/Validators/User/StoreValidator'
import Update from 'App/Validators/User/UpdateValidator'

export default class UsersController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, name, password, phoneNumber } = await request.validate(Store)
    const CreatedUser = await User.create({ email, name, password, phoneNumber })

    if (request.file('profileImage')) await this.saveImage(request.file('profileImage'), email)
    const token = await auth.attempt(email, password)

    response.created({ response: { CreatedUser, token } })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { email, name, password, phoneNumber } = await request.validate(Update)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    await bouncer.authorize('updateUser', user)

    user.name = name
    user.password = password
    if (email) user.email = email
    if (phoneNumber) user.phoneNumber = phoneNumber

    await user.save()

    response.ok({ response: { user } })
  }

  private async saveImage(image: any, email: string) {
    const clientImage: UserImageTypes = image
    clientImage.clientName = `${cuid()}.${clientImage.extname}`
    await clientImage.move(Application.tmpPath('uploads'))

    await User.updateOrCreate({ email }, { profileImage: clientImage.data.clientName })
  }
}
