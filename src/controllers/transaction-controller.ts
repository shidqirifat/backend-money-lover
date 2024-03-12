import { type TransactionRequest } from '@/models/transaction'
import { type AuthRequest } from '@/models/user'
import { TransactionService } from '@/services/transaction-service'
import { json } from '@/utils/json'
import { type User } from '@prisma/client'
import type { NextFunction, Response } from 'express'

export class TransactionController {
  static async create (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as TransactionRequest
      const response = await TransactionService.create(req.user as User, request)

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }
}
