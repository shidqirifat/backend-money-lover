import { UserController } from '@/controllers/user-controller'
import { authMiddleware } from '@/middleware/auth-middleware'
import express from 'express'

const apiRouter = express.Router()

apiRouter.use(authMiddleware)

apiRouter.post('/api/auth/logout', UserController.logout)

export default apiRouter
