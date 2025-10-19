export class VarianteControlador {
  constructor ({ varianteServicio }) {
    this.varianteServicio = varianteServicio
  }

  crearVariante = async (req, res) => {
    const body = req.body
    const options = req.user
    const nuevaVariante = await this.varianteServicio.crearVariante(body, options)
    if (nuevaVariante.error) return res.status(400).json(nuevaVariante)
    return res.status(201).json(nuevaVariante)
  }

  toggleEstadoVariante = async (req, res) => {
    const { id } = req.params
    const varianteCambiada = await this.varianteServicio.toggleEstadoVariante(id)
    if (varianteCambiada.error) return res.status(400).json(varianteCambiada)
    return res.status(200).json(varianteCambiada)
  }

  eliminarVariante = async (req, res) => {
    const { id } = req.params
    const options = req.user
    const varianteEliminada = await this.varianteServicio.eliminarVariante(id, options)
    if (varianteEliminada.error) return res.status(400).json(varianteEliminada)
    return res.status(200).json(varianteEliminada)
  }

  actualizarVariante = async (req, res) => {
    const body = req.body
    const options = req.user
    const { id } = req.params
    const varianteActualizada = await this.varianteServicio.actualizarVariante(id, body, options)
    if (varianteActualizada.error) return res.status(400).json(varianteActualizada)
    return res.status(200).json(varianteActualizada)
  }
}
