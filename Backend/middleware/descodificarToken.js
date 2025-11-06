import { token } from '../config/autenticacionEmail.js'

export const decodificarToken = (req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress
  const authHeader = req?.headers?.authorization || null

  // Si no hay cabecera de autorización, continuar sin usuario
  if (!authHeader) return next()

  // Permitir tanto "Bearer <token>" como el token directo
  const rawToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader

  try {
    const user = token.verificarToken(rawToken)
    req.user = { id: user.id, ip }
    return next()
  } catch (err) {
    // Token inválido o expirado: responder 401 en lugar de 500
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
