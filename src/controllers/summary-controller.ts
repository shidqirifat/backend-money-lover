import { type AuthRequest } from '@/models/user'
import { SummaryService } from '@/services/summary-service'
import { json } from '@/utils/json'
import { type User } from '@prisma/client'
import type { NextFunction, Response } from 'express'

export class SummaryController {
  static async getSummaryWallet (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await SummaryService.getSummaryWallet(req.user as User)

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }
}
