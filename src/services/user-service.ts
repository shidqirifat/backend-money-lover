import { ResponseError } from '@/errors/response-error'
import { toAuthResponse } from '@/models/user'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/models/user'
import { comparePassword, hashPassword } from '@/utils/hash'
import db from '@/utils/prisma'
import { generateToken } from '@/utils/token'
import { UserValidation } from '@/validations/user'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class UserService {
  static async register (request: RegisterRequest): Promise<AuthResponse> {
    const validateReq = Validation.validate(UserValidation.REGISTER, request)

    const user = await db.user.findUnique({
      where: { email: validateReq.email }
    })

    if (user) throw new ResponseError(400, 'Email is registered')

    const encryptPassword = await hashPassword(validateReq.password)

    const authUser = await db.user.create({
      data: {
        name: validateReq.name,
        email: validateReq.email,
        password: encryptPassword,
        token: generateToken()
      }
    })

    return toAuthResponse(authUser)
  }

  static async login (request: LoginRequest): Promise<AuthResponse> {
    const validateReq = Validation.validate(UserValidation.LOGIN, request)

    const user = await db.user.findUnique({
      where: { email: validateReq.email }
    })

    if (!user) throw new ResponseError(400, 'User is not registered yet')

    const isPasswordCorrect = await comparePassword(validateReq.password, user.password)
    if (!isPasswordCorrect) {
      throw new ResponseError(400, 'Email or password is not correct')
    }

    const authUser = await db.user.update({
      where: { id: user.id },
      data: {
        token: generateToken()
      }
    })

    return toAuthResponse(authUser)
  }

  static async logout (user: User) {
    await db.user.update({
      where: { id: user.id },
      data: { token: '' }
    })
  }
}
