import type { Wallet, Transaction, Category, SubCategory } from '@prisma/client'

export type TransactionResponse = {
  id: number
  amount: bigint
  description: string
  date: string
  wallet: string
  category: string
  sub_category: string | null
}

export type TransactionRequest = {
  description: string
  amount: number
  date: string
  categoryId: number
  subCategoryId: number | null
  walletId: number
}

export type TransactionWithRelation = Transaction & {
  wallet: Wallet
  category: Category
  subCategory: SubCategory | null
}

export const toTransactionResponse = (transaction: TransactionWithRelation): TransactionResponse => {
  return {
    id: transaction.id,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
    category: transaction.category.name,
    sub_category: transaction.subCategory?.name || null,
    wallet: transaction.wallet?.name
  }
}
