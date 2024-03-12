import type { ParamsTransaction, TransactionRequest } from '@/models/transaction'
import { type AuthRequest } from '@/models/user'
import { TransactionService } from '@/services/transaction-service'
import { json } from '@/utils/json'
import { type User } from '@prisma/client'
import type { NextFunction, Response } from 'express'

export class TransactionController {
  static async getAll (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await TransactionService.getAll(req.user as User, req.query as ParamsTransaction)

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }

  static async get (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await TransactionService.get(req.user as User, Number(req.params.id))

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }

  static async create (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as TransactionRequest
      const response = await TransactionService.create(req.user as User, request)

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }

  static async update (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await TransactionService.update(req)

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }

  static async delete (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await TransactionService.delete(req.user as User, Number(req.params.id))

      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }
}
