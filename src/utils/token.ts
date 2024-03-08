export const generateToken = (): string => {
  return crypto.randomUUID()
}

export const getTokenFromHeader = (tokenHeader: string) => {
  const regex = /Bearer\s+(\S+)/
  const match = tokenHeader.match(regex)

  if (match) return match[1]
  return ''
}
