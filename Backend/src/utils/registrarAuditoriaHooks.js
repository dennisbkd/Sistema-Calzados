import { Bitacora } from '../models/index.js'
import { BitacoraServicio } from '../services/bitacora.js'

const bitacoraServicio = new BitacoraServicio({ modeloBitacora: Bitacora })

export const registrarAuditoriaHooks = (modelo, nombreModelo) => {
  if (!modelo || nombreModelo === 'Bitacora') return

  modelo.addHook('beforeUpdate', async (instancia, options) => {
    console.log(instancia)
    instancia._before = { ...instancia._previousDataValues }
  })

  modelo.addHook('afterUpdate', async (instancia, options) => {
    console.log('afterUpdate hook triggered', instancia)
    await bitacoraServicio.crearBitacora({
      usuarioId: options?.id || 1,
      ip: options?.ip || '0.0.0.0',
      accion: 'UPDATE',
      tablaAfectada: nombreModelo,
      registroId: instancia.id,
      datosAnteriores: instancia._before,
      datosNuevos: instancia.dataValues
    })
  })

  modelo.addHook('afterCreate', async (instancia, options) => {
    console.log('afterCreate hook triggered', instancia)
    await bitacoraServicio.crearBitacora({
      usuarioId: options?.context?.id || 1,
      ip: options?.context?.ip || '0.0.0.0',
      accion: 'CREATE',
      tablaAfectada: nombreModelo,
      registroId: instancia.id,
      datosAnteriores: {},
      datosNuevos: instancia.dataValues
    })
  })

  modelo.addHook('afterDestroy', async (instancia, options) => {
    await bitacoraServicio.crearBitacora({
      usuarioId: options?.context?.id || 1,
      ip: options?.context?.ip || '0.0.0.0',
      accion: 'DELETE',
      tablaAfectada: nombreModelo,
      registroId: instancia.id,
      datosAnteriores: instancia.dataValues,
      datosNuevos: {}
    })
  })
}
