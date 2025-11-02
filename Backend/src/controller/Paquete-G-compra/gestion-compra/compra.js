export class CompraControlador {
  constructor ({ compraServicio }) {
    this.compraServicio = compraServicio
  }

  registrarCompra = async (req, res) => {
    try {
      const input = req.body
      const options = {
        context: {
          ip: req.user?.ip,
          id: req.user?.id
        }
      }
      const resultado = await this.compraServicio.registrarCompra(input, options)
      if (resultado.error) return res.status(400).json(resultado.error)
      return res.status(201).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // editar una compra
  editarCompra = async (req, res) => {
    try {
      const input = req.body
      const options = {
        context: {
          ip: req.user?.ip,
          id: req.user?.id
        }
      }
      const datos = await this.compraServicio.modeloCompra.findByPk(input.id)
      if (!datos) return res.status(404).json({ error: 'Compra no encontrada' })
      const resultado = await this.compraServicio.editarCompra(input, options)
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // eliminar una compra
  eliminarCompra = async (req, res) => {
    try {
      const input = req.params
      const options = {
        context: {
          ip: req.user?.ip,
          id: req.user?.id
        }
      }
      const resultado = await this.compraServicio.eliminarCompra(input, options)
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // listar todas las compras
  listarCompras = async (req, res) => {
    try {
      const resultado = await this.compraServicio.listarCompras()
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // generar codigo de factura unico
  generarCodigoFactura = async (req, res) => {
    try {
      const resultado = await this.compraServicio.generarCodigoFactura()
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  cambiarEstadoCompra = async (req, res) => {
    try {
      const input = req.body
      const options = {
        context: {
          ip: req.user?.ip,
          id: req.user?.id
        }
      }
      const resultado = await this.compraServicio.cambiarEstadoCompra(input, options)
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  generarFactura = async (req, res) => {
    try {
      const input = req.params
      const resultado = await this.compraServicio.generarFactura({ input })
      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }
}
