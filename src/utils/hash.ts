const bcrypt = require('bcrypt')

export async function hashPassword (password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

export async function comparePassword (
  password: string,
  hash: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, hash)
  return result
}
