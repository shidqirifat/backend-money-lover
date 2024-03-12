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
  wallet: Entity
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
