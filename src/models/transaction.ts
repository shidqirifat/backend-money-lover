import type { Wallet, Transaction, Category, SubCategory } from '@prisma/client'

type Entity = {
  id: number
  name: string
}

export type TransactionResponse = {
  id: number
  amount: bigint
  description: string
  date: string
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

export type ParamsTransaction = {
  startDate: string
  endDate: string
  keyword: string
}

export type TransactionWithRelation = Transaction & {
  wallet: Wallet
  category: Category
  subCategory: SubCategory | null
}

const baseTransactionResponse = (transaction: TransactionWithRelation) => {
  return {
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
    category: {
      id: transaction.category.id,
      name: transaction.category.name
    },
    sub_category: transaction.subCategory?.id
      ? {
          id: transaction.subCategory.id,
          name: transaction.subCategory.name
        }
      : null
  }
}

export const toListTransactionResponse = (transactions: TransactionWithRelation[]): TransactionResponse[] => {
  return transactions.map(transaction => (baseTransactionResponse(transaction)))
}

export const toTransactionResponse = (transaction: TransactionWithRelation): TransactionResponse => {
  return {
    ...baseTransactionResponse(transaction),
    wallet: {
      id: transaction.wallet.id,
      name: transaction.wallet.name
    }
  }
}
