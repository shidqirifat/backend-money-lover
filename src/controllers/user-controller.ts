import type { RegisterRequest, LoginRequest } from '@/models/user'
import { UserService } from '@/services/user-service'
import type { NextFunction, Request, Response } from 'express'

export class UserController {
  static async register (req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterRequest
      const response = await UserService.register(request)
      res.status(200).json({
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async login (req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginRequest
      const response = await UserService.login(request)
      res.status(200).json({
        data: response
      })
    } catch (error) {
      next(error)
    }
  }
}
