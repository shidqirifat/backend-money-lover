export const SEED_MASTER_CATEGORY_TRANSACTIONS = ['Expense', 'Income', 'Debt/Loan']

export const SEED_CATEGORIES_EXPENSE = ['Bills and Utilities', 'Food and Beverage', 'Family', 'Health and Fitness']

export const SEED_CATEGORIES_INCOME = ['Sallary', 'Side Hustle', 'Other Income']

export const SEED_SUB_CATEGORIES = {
  [SEED_CATEGORIES_EXPENSE[0]]: [
    'Electricity Bill',
    'Internet Bill',
    'Phone Bill'
  ],
  [SEED_CATEGORIES_EXPENSE[1]]: [
    'Cafe',
    'Restaurant'
  ],
  [SEED_CATEGORIES_EXPENSE[2]]: [
    'Home Stock',
    'Pets'
  ],
  [SEED_CATEGORIES_EXPENSE[3]]: [
    'Doctor',
    'Personal Care'
  ]
}
