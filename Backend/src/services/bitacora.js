export class BitacoraServicio {
  constructor ({ modeloBitacora }) {
    this.modeloBitacora = modeloBitacora
  }

  crearBitacora = async ({ usuarioId, accion, tablaAfectada, registroId, datosAnteriores, datosNuevos, ip }) => {
    try {
      await this.modeloBitacora.create({
        usuarioId,
        accion,
        tablaAfectada,
        registroId,
        datosAnteriores,
        datosNuevos,
        ip
      })
    } catch (e) {
      console.error(e)
      throw new Error('Error al registrar en la bitácora: ' + e.message)
    }
  }
}
