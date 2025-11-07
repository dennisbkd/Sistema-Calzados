import nodemailer from 'nodemailer'

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
