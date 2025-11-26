import { Op } from 'sequelize'

export class UbicacionServicio {
  constructor ({
    modeloZonaBodega,
    modeloUbicacionFisica,
    modeloInventarioUbicacion,
    modeloProductoVariante,
    modeloProducto
  }) {
    this.modeloZonaBodega = modeloZonaBodega
    this.modeloUbicacionFisica = modeloUbicacionFisica
    this.modeloInventarioUbicacion = modeloInventarioUbicacion
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloProducto = modeloProducto
  }

  // Obtener todas las zonas con conteo de variantes
  listarZonas = async () => {
    try {
      const zonas = await this.modeloZonaBodega.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'color',
          'icono',
          'layout_config',
          'activa',
          'createdAt'
        ],
        include: [{
          model: this.modeloUbicacionFisica,
          as: 'ubicaciones',
          attributes: ['id'],
          include: [{
            model: this.modeloInventarioUbicacion,
            as: 'inventarios',
            attributes: ['varianteId']
          }]
        }],
        where: { activa: true },
        order: [['createdAt', 'ASC']]
      })

      if (zonas.length === 0) return { error: 'No hay zonas registradas' }

      const zonasDto = zonas.map((zona) => {
        // Contar variantes únicas en toda la zona
        const variantesCount = new Set()
        zona.ubicaciones.forEach(ubicacion => {
          ubicacion.inventarios.forEach(inventario => {
            variantesCount.add(inventario.varianteId)
          })
        })

        // Layout por defecto si no existe
        const layoutConfig = zona.layout_config || {
          size: 'normal',
          position: { row: 0, col: 0 },
          span: { rows: 1, cols: 1 }
        }

        return {
          id: zona.id,
          nombre: zona.nombre,
          descripcion: zona.descripcion,
          color: zona.color,
          icono: zona.icono,
          layoutConfig,
          activa: zona.activa,
          cantidadVariantes: variantesCount.size,
          createdAt: zona.createdAt
        }
      })

      return zonasDto
    } catch (e) {
      return { error: 'Error al consultar las zonas', e }
    }
  }

  // Obtener ubicaciones de una zona específica
  obtenerUbicacionesPorZona = async (zonaId) => {
    console.log('zonaId en servicio:', zonaId)
    try {
      const ubicaciones = await this.modeloUbicacionFisica.findAll({
        attributes: ['id', 'codigo', 'descripcion', 'capacidadMaxima', 'activa'],
        include: [{
          model: this.modeloZonaBodega,
          as: 'zonaBodega',
          attributes: ['id', 'nombre']
        }, {
          model: this.modeloInventarioUbicacion,
          as: 'inventarios',
          attributes: ['id', 'varianteId', 'cantidad'],
          include: [{
            model: this.modeloProductoVariante,
            as: 'variante',
            attributes: ['id', 'codigo', 'talla', 'color'],
            include: [{
              model: this.modeloProducto,
              as: 'producto',
              attributes: ['id', 'nombre', 'marca']
            }]
          }]
        }],
        where: {
          zonaBodegaId: zonaId,
          activa: true
        }
      })

      if (ubicaciones.length === 0) return []

      const ubicacionesDto = ubicaciones.map((ubicacion) => {
        const variantesCount = new Set(ubicacion.inventarios.map(inv => inv.varianteId)).size
        const stockTotal = ubicacion.inventarios.reduce((sum, inv) => sum + inv.cantidad, 0)

        return {
          id: ubicacion.id,
          codigo: ubicacion.codigo,
          descripcion: ubicacion.descripcion,
          capacidadMaxima: ubicacion.capacidadMaxima,
          activa: ubicacion.activa,
          zona: ubicacion.zonaBodega.nombre,
          cantidadVariantes: variantesCount,
          stockTotal,
          inventarios: ubicacion.inventarios.map(inv => ({
            id: inv.id,
            varianteId: inv.varianteId,
            cantidad: inv.cantidad,
            codigo: inv.variante.codigo,
            talla: inv.variante.talla,
            color: inv.variante.color,
            producto: inv.variante.producto.nombre,
            marca: inv.variante.producto.marca
          }))
        }
      })

      return ubicacionesDto
    } catch (e) {
      console.log('Error en obtenerUbicacionesPorZona:', e)
      return { error: 'Error al consultar las ubicaciones', e }
    }
  }

  // Agregar múltiples variantes a una ubicación
  agregarVariantesUbicacion = async (ubicacionId, variantes) => {
    try {
      const ubicacion = await this.modeloUbicacionFisica.findByPk(ubicacionId)
      if (!ubicacion) {
        return { error: 'Ubicación no encontrada' }
      }

      const resultados = []

      for (const variante of variantes) {
        const { varianteId, cantidad } = variante

        // Verificar si la variante existe
        const varianteExistente = await this.modeloProductoVariante.findByPk(varianteId)
        if (!varianteExistente) {
          resultados.push({ varianteId, error: 'Variante no encontrada' })
          continue
        }

        // Buscar si ya existe el registro
        const inventarioExistente = await this.modeloInventarioUbicacion.findOne({
          where: { ubicacionId, varianteId }
        })

        if (inventarioExistente) {
          // Actualizar cantidad existente
          inventarioExistente.cantidad += cantidad
          await inventarioExistente.save()
          resultados.push({
            varianteId,
            accion: 'actualizado',
            cantidadActual: inventarioExistente.cantidad
          })
        } else {
          // Crear nuevo registro
          await this.modeloInventarioUbicacion.create({
            ubicacionId,
            varianteId,
            cantidad
          })
          resultados.push({ varianteId, accion: 'creado', cantidad })
        }
      }

      return {
        ubicacionId,
        ubicacionCodigo: ubicacion.codigo,
        resultados
      }
    } catch (e) {
      return { error: 'Error al agregar variantes a la ubicación', e }
    }
  }

  // Remover variantes de una ubicación
  removerVariantesUbicacion = async (ubicacionId, variantesIds) => {
    try {
      const ubicacion = await this.modeloUbicacionFisica.findByPk(ubicacionId)
      if (!ubicacion) {
        return { error: 'Ubicación no encontrada' }
      }

      const resultados = []

      for (const varianteId of variantesIds) {
        const inventario = await this.modeloInventarioUbicacion.findOne({
          where: { ubicacionId, varianteId }
        })

        if (inventario) {
          await inventario.destroy()
          resultados.push({ varianteId, accion: 'eliminado' })
        } else {
          resultados.push({ varianteId, error: 'No encontrado en esta ubicación' })
        }
      }

      return {
        ubicacionId,
        ubicacionCodigo: ubicacion.codigo,
        resultados
      }
    } catch (e) {
      return { error: 'Error al remover variantes de la ubicación', e }
    }
  }

  obtenerVariantesDisponibles = async (ubicacionId, filtros = {}) => {
    try {
      const { searchTerm = '' } = filtros

      // Primero obtener las variantes que YA están en esta ubicación
      const variantesEnUbicacion = await this.modeloInventarioUbicacion.findAll({
        where: { ubicacionId },
        attributes: ['varianteId']
      })

      const variantesIdsEnUbicacion = variantesEnUbicacion.map(item => item.varianteId)

      // Buscar variantes que NO están en esta ubicación
      const whereConditions = {
        activo: true
      }

      if (searchTerm) {
        whereConditions[Op.or] = [
          { codigo: { [Op.like]: `%${searchTerm}%` } },
          { '$producto.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$producto.marca$': { [Op.like]: `%${searchTerm}%` } },
          { color: { [Op.like]: `%${searchTerm}%` } }
        ]
      }

      if (variantesIdsEnUbicacion.length > 0) {
        whereConditions.id = { [Op.notIn]: variantesIdsEnUbicacion }
      }

      const variantes = await this.modeloProductoVariante.findAll({
        attributes: [
          'id',
          'codigo',
          'talla',
          'color',
          'precioVenta',
          'stockActual'
        ],
        include: [{
          model: this.modeloProducto,
          as: 'producto',
          attributes: ['id', 'nombre', 'marca', 'descripcion'],
          where: { activo: true }
        }],
        where: whereConditions,
        order: [['codigo', 'ASC']],
        limit: 50 // Limitar resultados para performance
      })

      const variantesDto = variantes.map(variante => ({
        id: variante.id,
        codigo: variante.codigo,
        talla: variante.talla,
        color: variante.color,
        precioVenta: variante.precioVenta,
        stockActual: variante.stockActual,
        producto: {
          id: variante.producto.id,
          nombre: variante.producto.nombre,
          marca: variante.producto.marca,
          descripcion: variante.producto.descripcion
        }
      }))

      return variantesDto
    } catch (e) {
      return { error: 'Error al obtener variantes disponibles', e }
    }
  }

  // Obtener variantes que están en una ubicación específica
  obtenerVariantesEnUbicacion = async (ubicacionId, filtros = {}) => {
    try {
      const { searchTerm = '' } = filtros

      const whereConditions = { ubicacionId }

      if (searchTerm) {
        whereConditions[Op.or] = [
          { '$variante.codigo$': { [Op.like]: `%${searchTerm}%` } },
          { '$variante.producto.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$variante.producto.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$variante.color$': { [Op.like]: `%${searchTerm}%` } }
        ]
      }

      const inventarios = await this.modeloInventarioUbicacion.findAll({
        attributes: ['id', 'varianteId', 'cantidad'],
        include: [{
          model: this.modeloProductoVariante,
          as: 'variante',
          attributes: ['id', 'codigo', 'talla', 'color', 'precioVenta'],
          include: [{
            model: this.modeloProducto,
            as: 'producto',
            attributes: ['id', 'nombre', 'marca', 'descripcion']
          }]
        }],
        where: whereConditions,
        order: [['variante', 'codigo', 'ASC']]
      })

      const variantesDto = inventarios.map(inventario => ({
        id: inventario.id, // ID del registro en InventarioUbicacion
        varianteId: inventario.varianteId,
        cantidad: inventario.cantidad,
        codigo: inventario.variante.codigo,
        talla: inventario.variante.talla,
        color: inventario.variante.color,
        precioVenta: inventario.variante.precioVenta,
        producto: {
          id: inventario.variante.producto.id,
          nombre: inventario.variante.producto.nombre,
          marca: inventario.variante.producto.marca,
          descripcion: inventario.variante.producto.descripcion
        }
      }))

      return variantesDto
    } catch (e) {
      return { error: 'Error al obtener variantes en ubicación', e }
    }
  }

  // Crear nueva ubicación
  crearUbicacion = async (datosUbicacion) => {
    try {
      const { zonaBodegaId, codigo, descripcion, capacidadMaxima } = datosUbicacion

      // Verificar que la zona existe
      const zonaExistente = await this.modeloZonaBodega.findByPk(zonaBodegaId)
      if (!zonaExistente) {
        return { error: 'La zona especificada no existe' }
      }

      // Verificar que el código sea único en la zona
      const ubicacionExistente = await this.modeloUbicacionFisica.findOne({
        where: {
          zonaBodegaId,
          codigo
        }
      })

      if (ubicacionExistente) {
        return { error: 'Ya existe una ubicación con este código en la zona seleccionada' }
      }

      // Crear la ubicación
      const nuevaUbicacion = await this.modeloUbicacionFisica.create({
        zonaBodegaId,
        codigo,
        descripcion,
        capacidadMaxima: capacidadMaxima || null,
        activa: true
      })

      // Obtener la ubicación creada con datos de la zona
      const ubicacionCreada = await this.modeloUbicacionFisica.findByPk(nuevaUbicacion.id, {
        include: [{
          model: this.modeloZonaBodega,
          as: 'zonaBodega',
          attributes: ['id', 'nombre']
        }]
      })

      return {
        id: ubicacionCreada.id,
        codigo: ubicacionCreada.codigo,
        descripcion: ubicacionCreada.descripcion,
        capacidadMaxima: ubicacionCreada.capacidadMaxima,
        activa: ubicacionCreada.activa,
        zonaBodegaId: ubicacionCreada.zonaBodegaId,
        zona: ubicacionCreada.zonaBodega.nombre,
        createdAt: ubicacionCreada.createdAt
      }
    } catch (e) {
      return { error: 'Error al crear la ubicación', e }
    }
  }

  crearZona = async (datosZona) => {
    try {
      const { nombre, descripcion, color = '#3B82F6', icono = 'warehouse', layoutConfig = null } = datosZona

      // Verificar que el nombre sea único
      const zonaExistente = await this.modeloZonaBodega.findOne({
        where: { nombre }
      })

      if (zonaExistente) {
        return { error: 'Ya existe una zona con este nombre' }
      }

      // Configuración de layout por defecto
      const defaultLayout = {
        size: 'normal', // 'normal', 'wide', 'tall', 'large', 'custom'
        position: { row: 0, col: 0 },
        span: { rows: 1, cols: 1 }
      }

      // Crear la zona
      const nuevaZona = await this.modeloZonaBodega.create({
        nombre,
        descripcion,
        color,
        icono,
        layout_config: layoutConfig || defaultLayout,
        activa: true
      })

      return {
        id: nuevaZona.id,
        nombre: nuevaZona.nombre,
        descripcion: nuevaZona.descripcion,
        color: nuevaZona.color,
        icono: nuevaZona.icono,
        layoutConfig: nuevaZona.layout_config,
        activa: nuevaZona.activa,
        cantidadVariantes: 0,
        createdAt: nuevaZona.createdAt
      }
    } catch (e) {
      return { error: 'Error al crear la zona', e }
    }
  }

  // Actualizar layout de una zona
  actualizarLayoutZona = async (zonaId, layoutConfig) => {
    try {
      const zona = await this.modeloZonaBodega.findByPk(zonaId)
      if (!zona) {
        return { error: 'Zona no encontrada' }
      }

      await zona.update({
        layout_config: layoutConfig
      })

      return {
        id: zona.id,
        layoutConfig: zona.layout_config
      }
    } catch (e) {
      return { error: 'Error al actualizar el layout', e }
    }
  }

  actualizarZonaCompleta = async (zonaId, datosActualizados) => {
    try {
      const zona = await this.modeloZonaBodega.findByPk(zonaId)
      if (!zona) {
        return { error: 'Zona no encontrada' }
      }

      // Actualizar los campos permitidos
      const camposPermitidos = ['color', 'icono', 'layout_config', 'descripcion']
      const datosParaActualizar = {}

      camposPermitidos.forEach(campo => {
        if (datosActualizados[campo] !== undefined) {
          datosParaActualizar[campo] = datosActualizados[campo]
        }
      })

      await zona.update(datosParaActualizar)

      // Obtener la zona actualizada
      const zonaActualizada = await this.modeloZonaBodega.findByPk(zonaId, {
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'color',
          'icono',
          'layout_config',
          'activa',
          'createdAt'
        ]
      })

      return {
        id: zonaActualizada.id,
        nombre: zonaActualizada.nombre,
        descripcion: zonaActualizada.descripcion,
        color: zonaActualizada.color,
        icono: zonaActualizada.icono,
        layoutConfig: zonaActualizada.layout_config,
        activa: zonaActualizada.activa,
        cantidadVariantes: zona.cantidadVariantes || 0 // Esto debería calcularse
      }
    } catch (e) {
      return { error: 'Error al actualizar la zona', e }
    }
  }

  // Eliminar zona (soft delete)
  eliminarZona = async (zonaId) => {
    try {
      const zona = await this.modeloZonaBodega.findByPk(zonaId)
      if (!zona) {
        return { error: 'Zona no encontrada' }
      }

      // Verificar si la zona tiene ubicaciones activas
      const ubicacionesCount = await this.modeloUbicacionFisica.count({
        where: {
          zonaBodegaId: zonaId,
          activa: true
        }
      })

      if (ubicacionesCount > 0) {
        return { error: 'No se puede eliminar la zona porque tiene ubicaciones activas' }
      }

      // Soft delete - marcar como inactiva
      await zona.update({ activa: false })

      return {
        mensaje: 'Zona eliminada correctamente',
        zonaId: zona.id
      }
    } catch (e) {
      return { error: 'Error al eliminar la zona', e }
    }
  }

  // Eliminar ubicación (soft delete)
  eliminarUbicacion = async (ubicacionId) => {
    try {
      const ubicacion = await this.modeloUbicacionFisica.findByPk(ubicacionId)
      if (!ubicacion) {
        return { error: 'Ubicación no encontrada' }
      }

      // Verificar si la ubicación tiene inventario
      const inventarioCount = await this.modeloInventarioUbicacion.count({
        where: { ubicacionId }
      })

      if (inventarioCount > 0) {
        return { error: 'No se puede eliminar la ubicación porque tiene variantes asignadas' }
      }

      // Soft delete - marcar como inactiva
      await ubicacion.update({ activa: false })

      return {
        mensaje: 'Ubicación eliminada correctamente',
        ubicacionId: ubicacion.id
      }
    } catch (e) {
      return { error: 'Error al eliminar la ubicación', e }
    }
  }

  // Eliminar zona forzadamente (incluyendo sus ubicaciones)
  eliminarZonaForzado = async (zonaId) => {
    try {
      const zona = await this.modeloZonaBodega.findByPk(zonaId)
      if (!zona) {
        return { error: 'Zona no encontrada' }
      }

      // Usar transacción para asegurar consistencia
      const transaction = await this.modeloZonaBodega.sequelize.transaction()

      try {
      // 1. Desactivar todas las ubicaciones de la zona
        await this.modeloUbicacionFisica.update(
          { activa: false },
          {
            where: { zonaBodegaId: zonaId },
            transaction
          }
        )

        // 2. Desactivar la zona
        await zona.update({ activa: false }, { transaction })

        // 3. Confirmar transacción
        await transaction.commit()

        return {
          mensaje: 'Zona y sus ubicaciones eliminadas correctamente',
          zonaId: zona.id
        }
      } catch (e) {
        await transaction.rollback()
        throw e
      }
    } catch (e) {
      return { error: 'Error al eliminar la zona', e }
    }
  }
}
