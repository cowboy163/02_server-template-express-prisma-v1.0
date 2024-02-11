import {Router} from 'express'
import publicRoute from './public'
import testRoute from './test'

const routes = Router()

routes.use('/public', publicRoute)
routes.use('/test', testRoute)



export default routes