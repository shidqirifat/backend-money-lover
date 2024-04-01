import { type AuthRequest } from '@/models/user'
import { type WalletRequest } from '@/models/wallet'
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

  static async create (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as WalletRequest
      const response = await WalletService.create(req.user as User, request)

      // return json with bigInt value
      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }

  static async update (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await WalletService.update(req)

      // return json with bigInt value
      res.status(200).type('json').send(json({ data: response }))
    } catch (error) {
      next(error)
    }
  }
}
