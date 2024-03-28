import { type Wallet } from '@prisma/client'

export type WalletResponse = {
  id: number
  name: string
  balance: bigint
}

export type UpdateWalletParams = { id: number }

export type UpdateWalletBody = {
  name: string
  balance: bigint
}

export const toWalletResponse = (wallet: Wallet): WalletResponse => {
  return {
    id: wallet.id,
    name: wallet.name,
    balance: wallet.balance
  }
}
