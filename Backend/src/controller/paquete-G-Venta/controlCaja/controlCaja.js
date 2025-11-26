export class ControlCajaControlador {
  constructor ({ controlCajaServicio }) {
    this.controlCajaServicio = controlCajaServicio
  }

  obtenerBalance = async (req, res) => {
    const { fecha } = req.query
    try {
      const balance = await this.controlCajaServicio.obtenerBalance({ fecha })
      if (balance.error) {
        return res.status(500).json({ error: balance.error })
      }
      return res.status(200).json(balance)
    } catch (error) {
      console.error('ControlCajaController.obtenerBalance falló:', error)
      return res.status(500).json({ error: 'Error al consultar el balance de caja' })
    }
  }
}
