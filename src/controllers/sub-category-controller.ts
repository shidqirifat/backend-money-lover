import { type CreateSubCategoryRequest } from '@/models/sub-category'
import { type AuthRequest } from '@/models/user'
import { SubCategoryService } from '@/services/sub-category-service'
import type { NextFunction, Response } from 'express'

export class SubCategoryController {
  static async create (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateSubCategoryRequest
      const response = await SubCategoryService.create(request)
      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
