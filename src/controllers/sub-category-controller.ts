import { type SubCategoryRequest } from '@/models/sub-category'
import { type AuthRequest } from '@/models/user'
import { SubCategoryService } from '@/services/sub-category-service'
import { type User } from '@prisma/client'
import type { NextFunction, Response } from 'express'

export class SubCategoryController {
  static async create (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as SubCategoryRequest
      const response = await SubCategoryService.create(request)
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  static async update (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await SubCategoryService.update(req)
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }

  static async delete (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await SubCategoryService.delete(req.user as User, Number(req.params.id))
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
