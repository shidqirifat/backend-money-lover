import type { CreateCategoryRequest } from '@/models/category'
import { type AuthRequest } from '@/models/user'
import { CategoryService } from '@/services/category-service'
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

  static async create (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateCategoryRequest
      const response = await CategoryService.create(req.user as User, request)
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  static async update (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await CategoryService.update(req)
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  static async delete (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await CategoryService.delete(req.user as User, Number(req.params.id))
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
