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
      from: '"Example Team" <prueba@gmail.com>',
      to,
      subject,
      html
    })
  }
}
