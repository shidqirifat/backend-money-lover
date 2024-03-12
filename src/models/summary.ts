type Wallet = {
  id: number
  name: string
  balance: bigint
}

export type SummaryWalletResponse = {
  total_balance: number
  wallets: Wallet[]
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
