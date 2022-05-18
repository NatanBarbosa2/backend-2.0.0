import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({ email: 'reisnatan94@gmail.com', password: '1234', name: 'turuobom' })
  }
}
