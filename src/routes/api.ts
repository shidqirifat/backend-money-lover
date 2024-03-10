import { CategoryController } from '@/controllers/category-controller'
import { MasterCategoryController } from '@/controllers/master-category-controller'
import { UserController } from '@/controllers/user-controller'
import { WalletController } from '@/controllers/wallet-contoller'
import { authMiddleware } from '@/middleware/auth-middleware'
import express from 'express'

const apiRouter = express.Router()

apiRouter.use(authMiddleware)

// AUTH
apiRouter.get('/api/auth', UserController.get)
apiRouter.post('/api/auth/logout', UserController.logout)

// WALLET
apiRouter.get('/api/wallets', WalletController.getAll)
apiRouter.put('/api/wallets/:id', WalletController.updateBalance)

// MASTER CATEGORY
apiRouter.get('/api/master-categories', MasterCategoryController.getAll)

// CATEGORY
apiRouter.get('/api/categories', CategoryController.getCategoriesByUser)

export default apiRouter
