import { ResponseError } from '@/errors/response-error'
import { toLoginResponse, type LoginRequest, type LoginResponse } from '@/models/user'
import { comparePassword } from '@/utils/hash'
import db from '@/utils/prisma'
import { generateToken } from '@/utils/token'
import { UserValidation } from '@/validations/user'
import { Validation } from '@/validations/validation'

export class UserService {
  static async login (request: LoginRequest): Promise<LoginResponse> {
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

    return toLoginResponse(authUser)
  }
}
