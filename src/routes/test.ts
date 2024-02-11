import {Router} from 'express'
import { TestController } from '../controller/TestController'

const testRoute = Router()

testRoute.post('/signup', TestController.signUp)
testRoute.post('/post', TestController.post)
testRoute.put('/post/:id/views', TestController.addViews)
testRoute.put('/publish/:id', TestController.publishPost)
testRoute.delete('/post/:id', TestController.deletePost)
testRoute.get('/users', TestController.getAllUsers)
testRoute.get('/user/:id/drafts', TestController.getUserDrafts)
testRoute.get('/post/:id', TestController.getPostById)
testRoute.get('/feed', TestController.feed)

export default testRoute