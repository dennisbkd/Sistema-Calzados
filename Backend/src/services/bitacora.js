// import bitacora  from "../models/bitacora.js"

export class BitacoraServicio {
  constructor ({ modeloBitacora }) {
    this.modeloBitacora = modeloBitacora
  }

  registrar = async ({ usuarioId, accion, tablaAfectada, registroId, datosAnteriores, datosNuevos, ip }) => {
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
      throw new Error('Error al registrar en la bitácora:' + e.message)
    }
  }
}
