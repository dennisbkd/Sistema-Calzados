export class UbicacionControlador {
  constructor ({ ubicacionServicio }) {
    this.ubicacionServicio = ubicacionServicio
  }

  listarZonas = async (req, res) => {
    try {
      const respuesta = await this.ubicacionServicio.listarZonas()
      if (respuesta.error) return res.status(404).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  obtenerUbicacionesPorZona = async (req, res) => {
    const { zonaId } = req.params
    console.log(zonaId)
    try {
      const respuesta = await this.ubicacionServicio.obtenerUbicacionesPorZona(zonaId)
      if (respuesta.error) return res.status(404).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  agregarVariantesUbicacion = async (req, res) => {
    const { ubicacionId } = req.params
    const { variantes } = req.body
    try {
      const respuesta = await this.ubicacionServicio.agregarVariantesUbicacion(
        parseInt(ubicacionId),
        variantes
      )
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  removerVariantesUbicacion = async (req, res) => {
    const { ubicacionId } = req.params
    const { variantesIds } = req.body
    try {
      const respuesta = await this.ubicacionServicio.removerVariantesUbicacion(
        parseInt(ubicacionId),
        variantesIds
      )
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  obtenerVariantesDisponibles = async (req, res) => {
    const { ubicacionId } = req.params
    const { search } = req.query

    try {
      const respuesta = await this.ubicacionServicio.obtenerVariantesDisponibles(
        parseInt(ubicacionId),
        { searchTerm: search || '' }
      )
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  obtenerVariantesEnUbicacion = async (req, res) => {
    const { ubicacionId } = req.params
    const { search } = req.query

    try {
      const respuesta = await this.ubicacionServicio.obtenerVariantesEnUbicacion(
        parseInt(ubicacionId),
        { searchTerm: search || '' }
      )
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(200).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  crearUbicacion = async (req, res) => {
    const body = req.body
    try {
      const respuesta = await this.ubicacionServicio.crearUbicacion(body)
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(201).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }

  crearZona = async (req, res) => {
    const body = req.body
    try {
      const respuesta = await this.ubicacionServicio.crearZona(body)
      if (respuesta.error) return res.status(400).json(respuesta)
      return res.status(201).json(respuesta)
    } catch (e) {
      return res.status(500).json({ error: `Error en el servidor: ${e.message}` })
    }
  }
}
