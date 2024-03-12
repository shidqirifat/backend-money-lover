import { CategoryController } from '@/controllers/category-controller'
import { MasterCategoryController } from '@/controllers/master-category-controller'
import { SubCategoryController } from '@/controllers/sub-category-controller'
import { SummaryController } from '@/controllers/summary-controller'
import { TransactionController } from '@/controllers/transaction-controller'
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
apiRouter.post('/api/categories', CategoryController.create)
apiRouter.put('/api/categories/:id', CategoryController.update)
apiRouter.delete('/api/categories/:id', CategoryController.delete)

// SUB CATEGORY
apiRouter.post('/api/sub-categories', SubCategoryController.create)
apiRouter.put('/api/sub-categories/:id', SubCategoryController.update)
apiRouter.delete('/api/sub-categories/:id', SubCategoryController.delete)

// TRANSACTION
apiRouter.get('/api/transactions', TransactionController.getAll)
apiRouter.get('/api/transactions/:id', TransactionController.get)
apiRouter.post('/api/transactions', TransactionController.create)
apiRouter.put('/api/transactions/:id', TransactionController.update)
apiRouter.delete('/api/transactions/:id', TransactionController.delete)

// SUMMARY
apiRouter.get('/api/summaries/wallet', SummaryController.getSummaryWallet)
apiRouter.get('/api/summaries/transaction', SummaryController.getSummaryTransaction)
apiRouter.get('/api/summaries/transaction/expense', SummaryController.getSummaryExpense)

export default apiRouter
