import { Op } from 'sequelize'
export class PromocionServicio {
  constructor ({
    modeloPromocion,
    modeloCategoria,
    modeloProducto,
    modeloVentaPromocion
  }) {
    this.modeloPromocion = modeloPromocion
    this.modeloCategoria = modeloCategoria
    this.modeloProducto = modeloProducto
    this.modeloVentaPromocion = modeloVentaPromocion
  }

  // Listar todas las promociones
  listarPromociones = async () => {
    try {
      const promociones = await this.modeloPromocion.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'tipo',
          'valorDescuento',
          'fechaInicio',
          'fechaFin',
          'activa',
          'aplicaCategoria',
          'aplicaProducto',
          'aplicaTodo',
          'createdAt'
        ],
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: ['id', 'nombre']
          },
          {
            model: this.modeloProducto,
            as: 'producto',
            attributes: ['id', 'nombre', 'marca']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (promociones.length === 0) return { error: 'No hay promociones registradas' }

      const promocionesDto = promociones.map(promocion => {
        const hoy = new Date()
        const fechaInicio = new Date(promocion.fechaInicio)
        const fechaFin = new Date(promocion.fechaFin)

        let estado = 'INACTIVA'
        if (promocion.activa) {
          if (hoy < fechaInicio) estado = 'PENDIENTE'
          else if (hoy > fechaFin) estado = 'EXPIRADA'
          else estado = 'ACTIVA'
        }

        return {
          id: promocion.id,
          nombre: promocion.nombre,
          descripcion: promocion.descripcion,
          tipo: promocion.tipo,
          valorDescuento: promocion.valorDescuento,
          fechaInicio: promocion.fechaInicio,
          fechaFin: promocion.fechaFin,
          activa: promocion.activa,
          estado,
          aplicaCategoria: promocion.aplicaCategoria,
          aplicaProducto: promocion.aplicaProducto,
          aplicaTodo: promocion.aplicaTodo,
          categoria: promocion.categoria,
          producto: promocion.producto,
          createdAt: promocion.createdAt
        }
      })

      return promocionesDto
    } catch (e) {
      return { error: 'Error al consultar las promociones', e }
    }
  }

  // Obtener promoción por ID
  obtenerPromocion = async (id) => {
    try {
      const promocion = await this.modeloPromocion.findByPk(id, {
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'tipo',
          'valorDescuento',
          'fechaInicio',
          'fechaFin',
          'activa',
          'aplicaCategoria',
          'aplicaProducto',
          'aplicaTodo',
          'categoriaId',
          'productoId',
          'createdAt'
        ],
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: ['id', 'nombre']
          },
          {
            model: this.modeloProducto,
            as: 'producto',
            attributes: ['id', 'nombre', 'marca']
          }
        ]
      })

      if (!promocion) return { error: 'Promoción no encontrada' }

      return promocion
    } catch (e) {
      return { error: 'Error al obtener la promoción', e }
    }
  }

  // Crear nueva promoción
  crearPromocion = async (datosPromocion) => {
    try {
      const {
        nombre,
        descripcion,
        tipo,
        valorDescuento,
        fechaInicio,
        fechaFin,
        aplicaCategoria = false,
        categoriaId = null,
        aplicaProducto = false,
        productoId = null,
        aplicaTodo = false
      } = datosPromocion

      // Validaciones
      if (!nombre || !tipo || !fechaInicio || !fechaFin) {
        return { error: 'Nombre, tipo, fecha inicio y fecha fin son requeridos' }
      }

      if (new Date(fechaInicio) >= new Date(fechaFin)) {
        return { error: 'La fecha de inicio debe ser anterior a la fecha de fin' }
      }

      if (tipo === 'PORCENTAJE' && (valorDescuento < 0 || valorDescuento > 100)) {
        return { error: 'El descuento porcentual debe estar entre 0 y 100' }
      }

      if (tipo === 'MONTO_FIJO' && valorDescuento < 0) {
        return { error: 'El descuento en monto fijo debe ser mayor a 0' }
      }

      // Validar que solo una opción de aplicación esté activa
      const opcionesActivas = [aplicaTodo, aplicaCategoria, aplicaProducto].filter(Boolean).length
      if (opcionesActivas !== 1) {
        return { error: 'Debe seleccionar exactamente una opción de aplicación (Todo, Categoría o Producto)' }
      }

      // Validar referencias si aplica
      if (aplicaCategoria && categoriaId) {
        const categoria = await this.modeloCategoria.findByPk(categoriaId)
        if (!categoria) return { error: 'La categoría especificada no existe' }
      }

      if (aplicaProducto && productoId) {
        const producto = await this.modeloProducto.findByPk(productoId)
        if (!producto) return { error: 'El producto especificado no existe' }
      }

      // Crear promoción
      const nuevaPromocion = await this.modeloPromocion.create({
        nombre,
        descripcion,
        tipo,
        valorDescuento,
        fechaInicio,
        fechaFin,
        aplicaCategoria,
        categoriaId: aplicaCategoria ? categoriaId : null,
        aplicaProducto,
        productoId: aplicaProducto ? productoId : null,
        aplicaTodo,
        activa: true
      })

      // Obtener promoción creada con relaciones
      const promocionCreada = await this.modeloPromocion.findByPk(nuevaPromocion.id, {
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: ['id', 'nombre']
          },
          {
            model: this.modeloProducto,
            as: 'producto',
            attributes: ['id', 'nombre', 'marca']
          }
        ]
      })

      return promocionCreada
    } catch (e) {
      return { error: 'Error al crear la promoción', e }
    }
  }

  // Actualizar promoción
  actualizarPromocion = async (id, datosActualizados) => {
    try {
      const promocion = await this.modeloPromocion.findByPk(id)
      if (!promocion) {
        return { error: 'Promoción no encontrada' }
      }

      const {
        tipo,
        valorDescuento,
        fechaInicio,
        fechaFin
      } = datosActualizados

      // Validaciones
      if (fechaInicio && fechaFin && new Date(fechaInicio) >= new Date(fechaFin)) {
        return { error: 'La fecha de inicio debe ser anterior a la fecha de fin' }
      }

      if (tipo === 'PORCENTAJE' && valorDescuento && (valorDescuento < 0 || valorDescuento > 100)) {
        return { error: 'El descuento porcentual debe estar entre 0 y 100' }
      }

      if (tipo === 'MONTO_FIJO' && valorDescuento && valorDescuento < 0) {
        return { error: 'El descuento en monto fijo debe ser mayor a 0' }
      }

      // Actualizar promoción
      await promocion.update(datosActualizados)

      // Obtener promoción actualizada
      const promocionActualizada = await this.modeloPromocion.findByPk(id, {
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: ['id', 'nombre']
          },
          {
            model: this.modeloProducto,
            as: 'producto',
            attributes: ['id', 'nombre', 'marca']
          }
        ]
      })

      return promocionActualizada
    } catch (e) {
      return { error: 'Error al actualizar la promoción', e }
    }
  }

  // Eliminar promoción (soft delete)
  eliminarPromocion = async (id) => {
    try {
      const promocion = await this.modeloPromocion.findByPk(id)
      if (!promocion) {
        return { error: 'Promoción no encontrada' }
      }

      // Verificar si la promoción está siendo usada en ventas
      const ventasConPromocion = await this.modeloVentaPromocion.count({
        where: { promocionId: id }
      })

      if (ventasConPromocion > 0) {
        return { error: 'No se puede eliminar la promoción porque está siendo usada en ventas' }
      }

      // Soft delete - marcar como inactiva
      await promocion.update({ activa: false })

      return {
        mensaje: 'Promoción eliminada correctamente',
        promocionId: promocion.id
      }
    } catch (e) {
      return { error: 'Error al eliminar la promoción', e }
    }
  }

  // Obtener promociones activas para una venta
  obtenerPromocionesActivas = async (productos = []) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]

      const promociones = await this.modeloPromocion.findAll({
        where: {
          activa: true,
          fechaInicio: { [Op.lte]: hoy },
          fechaFin: { [Op.gte]: hoy }
        },
        include: [
          {
            model: this.modeloCategoria,
            as: 'categoria',
            attributes: ['id', 'nombre']
          },
          {
            model: this.modeloProducto,
            as: 'producto',
            attributes: ['id', 'nombre', 'marca']
          }
        ]
      })

      // Filtrar promociones aplicables a los productos
      const promocionesAplicables = promociones.filter(promocion => {
        if (promocion.aplicaTodo) return true

        if (promocion.aplicaCategoria && promocion.categoria) {
          return productos.some(producto => producto.categoriaId === promocion.categoria.id)
        }

        if (promocion.aplicaProducto && promocion.producto) {
          return productos.some(producto => producto.productoId === promocion.producto.id)
        }

        return false
      })

      return promocionesAplicables
    } catch (e) {
      return { error: 'Error al obtener promociones activas', e }
    }
  }
}
