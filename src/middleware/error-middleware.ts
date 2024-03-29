import { ResponseError } from '@/errors/response-error'
import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.flatten() })
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      error: { message: error.message }
    })
  } else {
    res.status(500).json({
      error: { message: error.message }
    })
  }
}
