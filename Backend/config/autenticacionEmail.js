import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Mailer, MailerResend } from '../src/utils/email.js'
import { Token } from '../src/utils/token.js'

dotenv.config()

// probando JWT para el manejo de la sesion.
export const token = new Token({
  PALABRA_SECRETA: process.env.PALABRA_SECRETA || 'PrieyvasparATOken',
  expiracion: process.env.JWT_EXPIRACION || '1h',
  jwt
})
export const mailer = new Mailer({
  host: process.env.SMTP_HOST || 'smtp.dominio.com',
  port: process.env.SMTP_PORT || 587,
  user: process.env.SMTP_USER || 'prueba@gmail.com',
  pass: process.env.SMTP_PASS || 'XYZ'
})

// CONFIGURACIÓN RESEND
export const mailerResend = new MailerResend({
  apiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'Sistema de Ventas <onboarding@resend.dev>'
})

export const stripeConfig = {
  claveSecreta: process.env.STRIPE_SECRET_KEY
}
