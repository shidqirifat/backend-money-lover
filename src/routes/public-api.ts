import { UserController } from '@/controllers/user-controller'
import express from 'express'

const publicRouter = express.Router()

publicRouter.post('/api/auth/register', UserController.register)

publicRouter.post('/api/auth/login', UserController.login)

export default publicRouter
