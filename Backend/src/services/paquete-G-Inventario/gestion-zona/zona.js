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
        attributes: ['id', 'nombre', 'descripcion', 'activa'],
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
        where: { activa: true }
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

        return {
          id: zona.id,
          nombre: zona.nombre,
          descripcion: zona.descripcion,
          activa: zona.activa,
          cantidadVariantes: variantesCount.size
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

  // Crear nueva zona
  crearZona = async (datosZona) => {
    try {
      const { nombre, descripcion } = datosZona

      // Verificar que el nombre sea único
      const zonaExistente = await this.modeloZonaBodega.findOne({
        where: { nombre }
      })

      if (zonaExistente) {
        return { error: 'Ya existe una zona con este nombre' }
      }

      // Crear la zona
      const nuevaZona = await this.modeloZonaBodega.create({
        nombre,
        descripcion,
        activa: true
      })

      return {
        id: nuevaZona.id,
        nombre: nuevaZona.nombre,
        descripcion: nuevaZona.descripcion,
        activa: nuevaZona.activa,
        cantidadVariantes: 0, // Nueva zona, sin variantes
        createdAt: nuevaZona.createdAt
      }
    } catch (e) {
      return { error: 'Error al crear la zona', e }
    }
  }
}
