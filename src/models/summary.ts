import { type Category, type Transaction } from '@prisma/client'

type Wallet = {
  id: number
  name: string
  balance: bigint
}

export type SummaryWalletResponse = {
  total_balance: number
  wallets: Wallet[]
}

export type ParamsSummaryTransaction = {
  startDate: string
  endDate: string
}

export type SummaryTransactionResponse = {
  income: number
  expense: number
  net_income: number
}

export enum TypeTransaction {
  EXPENSE = 1,
  INCOME = 2
}

export interface TransactionWithCategory extends Transaction {
  category: Category
}

export const toSummaryWalletResponse = (wallets: Wallet[]): SummaryWalletResponse => {
  const totalBalance = wallets.reduce((total, wallet) => {
    return total += Number(wallet.balance)
  }, 0)

  return {
    total_balance: totalBalance,
    wallets
  }
}

export const toSummaryTransactionResponse = (transactions: TransactionWithCategory[]): SummaryTransactionResponse => {
  const data: SummaryTransactionResponse = {
    expense: 0,
    income: 0,
    net_income: 0
  }

  for (const transaction of transactions) {
    switch (transaction.category.masterCategoryTransactionId) {
      case TypeTransaction.EXPENSE:
        data.expense += Number(transaction.amount)
        break
      case TypeTransaction.INCOME:
        data.income += Number(transaction.amount)
        break
      default:
        break
    }
  }

  data.net_income = data.income - data.expense

  return data
}
