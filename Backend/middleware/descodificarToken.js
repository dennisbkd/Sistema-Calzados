import { token } from '../config/autenticacionEmail.js'

export const decodificarToken = (req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress
  const authHeader = req?.headers?.authorization?.split(' ')[1] || null

  if (!authHeader) {
    return next()
  }
  const user = token.verificarToken(authHeader)
  req.user = { id: user.id, ip }
  next()
}
