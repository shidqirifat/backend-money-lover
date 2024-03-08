import { type AuthRequest } from '@/models/user'
import { MasterCategoryService } from '@/services/master-category-service'
import type { NextFunction, Response } from 'express'

export class MasterCategoryController {
  static async getAll (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await MasterCategoryService.getAll()

      res.status(200).json({ data: response })
    } catch (error) {
      next(error)
    }
  }
}
