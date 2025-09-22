import { Router } from 'express'
import { AutorizacionControlador } from '../controller/Auth/autorizacion.js'

export const rutaAutorizacion = ({ autorizacionServicio }) => {
  const ruta = Router()
  const autorizacionControlador = new AutorizacionControlador({ autorizacionServicio })

  ruta.post('/login', autorizacionControlador.iniciarSesion)
  ruta.post('/solicitar-recumperamiento', autorizacionControlador.solicitaRecuperamientoPassword)
  ruta.post('/restablecer-password', autorizacionControlador.resetearPassword)

  // test para que funcione en el backend, luego se eliminara para que funcione en el frontend.
  // quedara pendiente.

  ruta.get('/restablecer-password', (req, res) => {
    const { token } = req.query
    if (!token) return res.status(400).send('Token no proporcionado')

    res.send(`
    <h2>Restablecer contraseña</h2>
    <form method="POST" action="/autorizacion/restablecer-password">
      <input type="hidden" name="token" value="${token}" />
      <input type="password" name="nuevaPassword" placeholder="Nueva contraseña" required />
      <button type="submit">Enviar</button>
    </form>
  `)
  })

  return ruta
}
