export const generateToken = (): string => {
  return crypto.randomUUID()
}
