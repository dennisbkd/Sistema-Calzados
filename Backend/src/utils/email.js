import nodemailer from 'nodemailer'
import { Resend } from 'resend'

export class Mailer {
  constructor ({ host, port, user, pass }) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: { user, pass }
    })
  }

  enviar = async ({ to, subject, html }) => {
    await this.transporter.sendMail({
      from: `sistema de ventas <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    })
  }
}

export class MailerResend {
  constructor ({ apiKey, fromEmail }) {
    this.resend = new Resend(apiKey || process.env.RESEND_API_KEY)
    this.fromEmail = fromEmail || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  }

  enviar = async ({ to, subject, html }) => {
    try {
      console.log(`📤 Enviando email via Resend a: ${to}`)
      console.log(`   Asunto: ${subject}`)

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html
      })

      if (error) {
        console.error('❌ Error Resend:', error)
        throw new Error(error.message)
      }

      console.log('✅ Email enviado exitosamente via Resend')
      console.log(`   ID: ${data.id}`)
      return data
    } catch (error) {
      console.error(`❌ Error enviando email a ${to}:`, error.message)
      throw error
    }
  }
}
