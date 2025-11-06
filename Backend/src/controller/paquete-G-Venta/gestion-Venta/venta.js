// controller/ventaControlador.js
export class VentaControlador {
  constructor ({ ventaServicio }) {
    this.ventaServicio = ventaServicio
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
}
