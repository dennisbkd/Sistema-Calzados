export class CompraControlador {
  constructor ({ compraServicio, bitacoraServicio }) {
    this.compraServicio = compraServicio
    this.bitacoraServicio = bitacoraServicio
  }

  // registrar una nueva compra
  registrarCompra = async (req, res) => {
    try {
      const input = req.body
      const resultado = await this.compraServicio.registrarCompra({ input })
      if (resultado.error) return res.status(400).json(resultado.error)

      const autor = req.user?.id || 1
      await this.bitacoraServicio.crearBitacora({
        usuarioId: autor,
        accion: 'CREAR',
        tablaAfectada: 'Compra',
        registroId: resultado.id,
        datosAnteriores: null,
        datosNuevos: JSON.stringify(input),
        ip: req.ip.replace('::ffff:', '')
      })

      return res.status(201).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // editar una compra
  editarCompra = async (req, res) => {
    try {
      const input = req.body
      const datos = await this.compraServicio.modeloCompra.findByPk(input.id)
      if (!datos) return res.status(404).json({ error: 'Compra no encontrada' })

      const datosAnteriores = datos.toJSON()
      const resultado = await this.compraServicio.editarCompra({ input })
      const autor = req.user?.id || 1

      await this.bitacoraServicio.crearBitacora({
        usuarioId: autor,
        accion: 'EDITAR',
        tablaAfectada: 'Compra',
        registroId: input.id,
        datosAnteriores,
        datosNuevos: JSON.stringify(input),
        ip: req.ip.replace('::ffff:', '')
      })

      return res.status(200).json(resultado)
    } catch (e) {
      return res.status(500).json({ error: 'Error en el servidor', e: e.message })
    }
  }

  // eliminar una compra
  eliminarCompra = async (req, res) => {
    try {
      const input = req.params
      const resultado = await this.compraServicio.eliminarCompra({ input })
      const autor = req.user?.id || 1

      await this.bitacoraServicio.crearBitacora({
        usuarioId: autor,
        accion: 'ELIMINAR',
        tablaAfectada: 'Compra',
        registroId: input.id,
        datosAnteriores: null,
        datosNuevos: null,
        ip: req.ip.replace('::ffff:', '')
      })

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
      const resultado = await this.compraServicio.cambiarEstadoCompra({ input })
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
