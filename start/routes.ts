/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// user <Criar/Atualizar>
Route.post('/api/user', 'UsersController.store')
Route.put('/api/user/:id', 'UsersController.update')

// session <Logar/Logout>
Route.post('/api/session', 'SessionsController.store')
Route.delete('/api/session', 'SessionsController.destroy')

// company <Empresa>
Route.post('/api/company', 'CompaniesController.store').middleware('auth')
Route.get('/api/company', 'CompaniesController.show').middleware('auth')
Route.put('/api/company/:id', 'CompaniesController.update').middleware('auth')
Route.delete('/api/company/:id', 'CompaniesController.destroy').middleware('auth')

// member <Membros da Empresa>
Route.post('/api/member/:companyId', 'MembersController.store').middleware('auth')
Route.get('/api/member/:companyId/:id/:type', 'MembersController.show').middleware('auth')
Route.put('/api/member/:companyId/:id', 'MembersController.update').middleware('auth')
Route.delete('/api/member/:companyId/:id', 'MembersController.destroy').middleware('auth')

// group <Grupo>
Route.post('/api/group/:companyId', 'GroupsController.store').middleware('auth')
Route.get('/api/group/:companyId/:id/:type', 'GroupsController.show').middleware('auth')
Route.put('/api/group/:companyId/:id', 'GroupsController.update').middleware('auth')
Route.delete('/api/group/:companyId/:id', 'GroupsController.destroy').middleware('auth')

// group request <O membro entrar no Grupo>
Route.post('/api/groupRequest/:companyId', 'GroupsRequestsController.store').middleware('auth')
Route.get('/api/groupRequest/:companyId/:id/:type', 'GroupsRequestsController.show').middleware(
  'auth'
)
// MANUTENÇÃO
Route.delete(
  '/api/groupRequest/:companyId/:id/:groupId/:type',
  'GroupsRequestsController.destroy'
).middleware('auth')
