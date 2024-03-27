import type { RegisterRequest, LoginRequest, AuthRequest, UpdateProfileRequest } from '@/models/user'
import { UserService } from '@/services/user-service'
import { type User } from '@prisma/client'
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

  static async get (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req.user as User)
      res.status(200).json({
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async update (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as UpdateProfileRequest
      const response = await UserService.update(req.user as User, request)
      res.status(200).json({
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async logout (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await UserService.logout(req.user as User)
      res.status(200).json({
        data: 'Successfully logout'
      })
    } catch (error) {
      next(error)
    }
  }
}
