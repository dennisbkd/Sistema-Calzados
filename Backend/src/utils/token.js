export class Token {
  constructor ({ PALABRA_SECRETA, expiracion = '1hr', jwt }) {
    this.PALABRA_SECRETA = PALABRA_SECRETA
    this.expiracion = expiracion
    this.jwt = jwt
  }

  crearToken = (usuario) => {
    const nuevoToken = this.jwt.sign(usuario, this.PALABRA_SECRETA, {
      expiresIn: this.expiracion
    })
    return nuevoToken
  }

  verificarToken = (token) => {
    return this.jwt.verify(token, this.PALABRA_SECRETA)
  }
}
