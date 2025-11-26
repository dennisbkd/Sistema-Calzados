export class PromocionControlador {
  constructor ({ promocionServicio }) {
    this.promocionServicio = promocionServicio
  }

  listarPromociones = async (req, res) => {
    try {
      const respuesta = await this.promocionServicio.listarPromociones()
      if (respuesta.error) return res.status(404).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  obtenerPromocion = async (req, res) => {
    const { id } = req.params
    try {
      const respuesta = await this.promocionServicio.obtenerPromocion(parseInt(id))
      if (respuesta.error) return res.status(404).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  crearPromocion = async (req, res) => {
    const body = req.body
    try {
      const respuesta = await this.promocionServicio.crearPromocion(body)
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(201).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  actualizarPromocion = async (req, res) => {
    const { id } = req.params
    const body = req.body
    try {
      const respuesta = await this.promocionServicio.actualizarPromocion(parseInt(id), body)
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  eliminarPromocion = async (req, res) => {
    const { id } = req.params
    try {
      const respuesta = await this.promocionServicio.eliminarPromocion(parseInt(id))
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  obtenerPromocionesActivas = async (req, res) => {
    const { productos } = req.body
    try {
      const respuesta = await this.promocionServicio.obtenerPromocionesActivas(productos)
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }
}
