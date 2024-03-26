import { type TransactionValidation } from '@/validations/transaction'
import type {
  Wallet,
  Transaction,
  Category,
  SubCategory,
  MasterCategoryTransaction
} from '@prisma/client'
import { type z } from 'zod'

type Entity = {
  id: number
  name: string
}

export type TransactionResponse = {
  id: number
  amount: bigint
  description: string
  date: string
  master_category_transaction: Entity
  wallet?: Entity
  category: Entity
  sub_category: Entity | null
}

export type TransactionRequest = {
  description: string
  amount: number
  date: string
  categoryId: number
  subCategoryId: number | null
  walletId: number
}

export type ParamsTransaction = z.infer<typeof TransactionValidation.GET_ALL>

export type TransactionWithRelation = Transaction & {
  wallet: Wallet
  category: Category & {
    masterCategoryTransaction: MasterCategoryTransaction
  }
  subCategory: SubCategory | null
}

export const toListTransactionResponse = (
  transactions: TransactionWithRelation[]
): TransactionResponse[] => {
  return transactions.map((transaction) => toTransactionResponse(transaction))
}

export const toTransactionResponse = (
  transaction: TransactionWithRelation
): TransactionResponse => {
  return {
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
    master_category_transaction: {
      id: transaction.category.masterCategoryTransaction.id,
      name: transaction.category.masterCategoryTransaction.name
    },
    category: {
      id: transaction.category.id,
      name: transaction.category.name
    },
    sub_category: transaction.subCategory?.id
      ? {
          id: transaction.subCategory.id,
          name: transaction.subCategory.name
        }
      : null,
    wallet: {
      id: transaction.wallet.id,
      name: transaction.wallet.name
    }
  }
}
