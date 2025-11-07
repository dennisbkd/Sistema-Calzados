// controller/ventaControlador.js
export class VentaControlador {
  constructor ({ ventaServicio, stripeServicio }) {
    this.ventaServicio = ventaServicio
    this.stripeServicio = stripeServicio
  }

  // Funciones existentes
  FiltrarProductoPorCategoria = async (req, res) => {
    const { id } = req.query
    const resultado = await this.ventaServicio.FiltrarProductoPorCategoria(id)
    if (resultado.error) {
      return res.status(500).json({ error: resultado.error })
    }
    return res.status(200).json(resultado)
  }

  BuscarProductos = async (req, res) => {
    const { termino } = req.query
    const resultado = await this.ventaServicio.BuscarProductos(termino)
    if (resultado.error) {
      return res.status(500).json({ error: resultado.error })
    }
    return res.status(200).json(resultado)
  }

  // Nuevas funciones
  crearVenta = async (req, res) => {
    const usuarioId = req.user?.id || 1
    const options = {
      context: {
        ip: req.user?.ip,
        id: usuarioId
      }
    }
    try {
      const venta = await this.ventaServicio.crearVenta(req.body, usuarioId, options)
      res.status(201).json(venta)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  actualizarVenta = async (req, res) => {
    try {
      const { id } = req.params
      const ventaActualizada = await this.ventaServicio.actualizarVenta(id, req.body)
      res.status(200).json(ventaActualizada)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  marcarComoPagada = async (req, res) => {
    try {
      const { id } = req.params
      const { metodoPagoId, referenciaPago } = req.body
      const usuarioId = req.user?.id || 1

      const ventaActualizada = await this.ventaServicio.marcarComoPagada(
        id,
        metodoPagoId,
        referenciaPago,
        usuarioId
      )

      return res.status(200).json(ventaActualizada)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  anularVenta = async (req, res) => {
    try {
      const { id } = req.params
      const { motivo } = req.body
      const usuarioId = req.user?.id || 1
      const resultado = await this.ventaServicio.anularVenta(id, usuarioId, motivo)
      if (resultado.error) {
        return res.status(400).json({ error: resultado.error })
      }
      return res.status(200).json(resultado)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  obtenerVenta = async (req, res) => {
    try {
      const { id } = req.params
      const venta = await this.ventaServicio.obtenerVentaPorId(id)
      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' })
      }
      return res.status(200).json(venta)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  listarVentas = async (req, res) => {
    try {
      const { pagina, limite, ...filtros } = req.query
      const ventas = await this.ventaServicio.listarVentas(
        parseInt(pagina) || 1,
        parseInt(limite) || 10,
        filtros
      )
      if (!ventas) {
        return res.status(404).json({ error: 'No se encontraron ventas' })
      }
      return res.status(200).json(ventas)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  obtenerMetodosPago = async (req, res) => {
    try {
      const metodosPago = await this.ventaServicio.obtenerMetodosPago()
      if (!metodosPago) {
        return res.status(404).json({ error: 'No se encontraron métodos de pago' })
      }
      return res.status(200).json(metodosPago)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  obtenerClientes = async (req, res) => {
    try {
      const clientes = await this.ventaServicio.obtenerClientes()
      if (!clientes) {
        return res.status(404).json({ error: 'No se encontraron clientes' })
      }
      return res.status(200).json(clientes)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  obtenerClientePorId = async (req, res) => {
    try {
      const { id } = req.params
      const cliente = await this.ventaServicio.obtenerClientePorId(id)
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' })
      }
      return res.status(200).json(cliente)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
  // funciones de stripe

  crearSessionPago = async (req, res) => {
    try {
      const { id } = req.params
      const venta = await this.ventaServicio.obtenerVentaPorId(id)

      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' })
      }

      if (venta.estado !== 'REGISTRADA') {
        return res.status(400).json({ error: 'Solo se pueden pagar ventas en estado REGISTRADA' })
      }
      const successUrl = `${process.env.FRONTEND_URL}/cliente/ventas/${id}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${process.env.FRONTEND_URL}/cliente/${id}`

      const session = await this.stripeServicio.crearSessionCheckout(venta, successUrl, cancelUrl)

      // Actualizar venta con session ID
      await this.ventaServicio.actualizarSessionPago(venta.id, session.id)

      return res.status(200).json({
        sessionId: session.id,
        urlPago: session.url
      })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  webhookStripe = async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
      event = this.stripeServicio.stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Manejar el evento de checkout completado
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      try {
        await this.ventaServicio.procesarPagoExitoso(
          parseInt(session.metadata.venta_id),
          session.id,
          session.payment_intent
        )
      } catch (error) {
        console.error('Error procesando pago:', error)
      }
    }

    res.json({ received: true })
  }

  verificarEstadoPago = async (req, res) => {
    try {
      const { id } = req.params
      const resultado = await this.ventaServicio.verificarEstadoPagoStripe(id)
      return res.status(200).json(resultado)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}
