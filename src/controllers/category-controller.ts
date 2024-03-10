import { type AuthRequest } from '@/models/user'
import { CategoryService } from '@/services/category'
import { type User } from '@prisma/client'
import type { NextFunction, Response } from 'express'

export class CategoryController {
  static async getCategoriesByUser (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await CategoryService.getCategoriesByUser(req.user as User)
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
