import { type AuthRequest } from '@/models/user'
import { WalletService } from '@/services/wallet-service'
import { json } from '@/utils/json'
import { type User } from '@prisma/client'
import type { NextFunction, Response } from 'express'

export class WalletController {
  static async getAll (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await WalletService.getAll(req.user as User)

      // return json with bigInt value
      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }

  static async updateBalance (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await WalletService.updateBalance(req)

      // return json with bigInt value
      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }
}
