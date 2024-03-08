import { UserController } from '@/controllers/user-controller'
import express from 'express'

const publicRouter = express.Router()

publicRouter.post('/api/auth', UserController.login)

export default publicRouter
