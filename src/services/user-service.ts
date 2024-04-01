import { ResponseError } from '@/errors/response-error'
import { toAuthResponse } from '@/models/user'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest
} from '@/models/user'
import { comparePassword, hashPassword } from '@/utils/hash'
import db from '@/utils/prisma'
import { generateToken } from '@/utils/token'
import { UserValidation } from '@/validations/user'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'
import { SEED_CATEGORIES_EXPENSE, SEED_CATEGORIES_INCOME, SEED_SUB_CATEGORIES } from '@/utils/seed'

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

    await db.category.createMany({
      data: [
        ...SEED_CATEGORIES_EXPENSE.map(category => (
          {
            name: category,
            userId: authUser.id,
            masterCategoryTransactionId: 1
          })),
        ...SEED_CATEGORIES_INCOME.map(category => (
          {
            name: category,
            userId: authUser.id,
            masterCategoryTransactionId: 2
          }))
      ]
    })

    const userCategories = await db.category.findMany({
      where: {
        user: { id: authUser.id }
      }
    })

    for (const category of userCategories) {
      if (!SEED_CATEGORIES_EXPENSE.includes(category.name)) continue
      if (!SEED_SUB_CATEGORIES[category.name]) continue

      await db.subCategory.createMany({
        data: SEED_SUB_CATEGORIES[category.name].map(subCategory => ({
          name: subCategory,
          categoryId: category.id
        }))
      })
    }

    await db.wallet.create({
      data: {
        name: 'Cash',
        balance: 0,
        userId: authUser.id
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

    const isPasswordCorrect = await comparePassword(
      validateReq.password,
      user.password
    )
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

  static async get (user: User): Promise<AuthResponse> {
    return toAuthResponse(user)
  }

  static async update (
    auth: User,
    request: UpdateProfileRequest
  ): Promise<AuthResponse> {
    const validateReq = Validation.validate(UserValidation.REGISTER, request)

    const user = await db.user.findFirst({
      where: { email: validateReq.email }
    })

    // Email is already use for another user
    if (user && user.id !== auth.id) { throw new ResponseError(400, 'Email is already use') }

    const encryptPassword = validateReq.password
      ? await hashPassword(validateReq.password)
      : auth.password

    const authUser = await db.user.update({
      where: { id: auth.id },
      data: {
        name: validateReq.name,
        email: validateReq.email,
        password: encryptPassword
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
