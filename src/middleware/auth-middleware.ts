import { type AuthRequest } from '@/models/user'
import db from '@/utils/prisma'
import { getTokenFromHeader } from '@/utils/token'
import type { NextFunction, Response } from 'express'

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const headerToken = req.get('Authorization')

  if (headerToken) {
    const token = getTokenFromHeader(headerToken)
    const user = await db.user.findFirst({
      where: { token }
    })

    if (user) {
      req.user = user
      next()
      return
    }
  }

  res.status(401).json({
    error: 'User is not authenticated'
  })
}
