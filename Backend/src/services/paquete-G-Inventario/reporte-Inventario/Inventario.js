import { Op } from 'sequelize'

export class InventarioServicio {
  constructor ({
    modeloProductoVariante,
    modeloProducto,
    modeloCategoria,
    modeloMovimientoInventario
  }) {
    this.modeloProductoVariante = modeloProductoVariante
    this.modeloProducto = modeloProducto
    this.modeloCategoria = modeloCategoria
    this.modeloMovimientoInventario = modeloMovimientoInventario
  }

  estadoInventario = async (filtros = {}) => {
    try {
      const { categoriaId, productoId, conStockBajo = false, activos = true } = filtros

      const { whereConditions, includeConditions } = this.construirCondicionesConsulta(
        categoriaId, productoId, conStockBajo, activos
      )

      const variantes = await this.obtenerVariantesConProductos(whereConditions, includeConditions)

      if (variantes.length === 0) {
        return { error: 'No se encontraron productos con los filtros aplicados' }
      }

      const estadisticas = this.calcularEstadisticasInventario(variantes)
      const inventarioDTO = this.mapearInventarioADTO(variantes)

      return { estadisticas, inventario: inventarioDTO }
    } catch (error) {
      return {
        error: 'Error al consultar el estado del inventario',
        detalle: error.message
      }
    }
  }

  reporteInventario = async (filtros = {}) => {
    try {
      const {
        tipoReporte = 'DETALLADO',
        categoriaId,
        productoId,
        conStockBajo = false,
        activos = true,
        fechaInicio,
        fechaFin
      } = filtros

      const { whereConditions, includeConditions } = this.construirCondicionesConsulta(
        categoriaId, productoId, conStockBajo, activos
      )

      if (fechaInicio && fechaFin) {
        whereConditions.createdAt = {
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
        }
      }

      const variantes = await this.obtenerVariantesConProductos(whereConditions, includeConditions)

      if (variantes.length === 0) {
        return { error: 'No se encontraron productos con los filtros aplicados' }
      }

      const estadisticas = this.calcularEstadisticasInventario(variantes)
      const inventarioDTO = this.mapearInventarioADTO(variantes)

      return {
        tipoReporte,
        fechaGeneracion: new Date(),
        parametros: filtros,
        estadisticas,
        inventario: inventarioDTO
      }
    } catch (error) {
      return {
        error: 'Error al generar el reporte de inventario',
        detalle: error.message
      }
    }
  }

  // Método para movimientos de inventario
  movimientosInventario = async (filtros = {}) => {
    try {
      const { fechaInicio, fechaFin, tipoMovimiento } = filtros

      const whereConditions = {}

      // Filtro por fecha
      if (fechaInicio && fechaFin) {
        whereConditions.createdAt = {
          [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
        }
      }

      if (tipoMovimiento) {
        whereConditions.tipoMovimiento = tipoMovimiento
      }

      const movimientos = await this.modeloMovimientoInventario.findAll({
        where: whereConditions,
        include: [
          {
            model: this.modeloProductoVariante,
            as: 'variante',
            attributes: ['id', 'talla', 'color', 'codigo'],
            include: [
              {
                model: this.modeloProducto,
                as: 'producto',
                attributes: ['id', 'nombre', 'marca'],
                include: [
                  {
                    model: this.modeloCategoria,
                    as: 'categoria',
                    attributes: ['id', 'nombre']
                  }
                ]
              }
            ]
          }
        ],
        attributes: [
          'id',
          'tipoMovimiento',
          'cantidad',
          'motivo',
          'documentoRef',
          'createdAt'
        ],
        order: [['createdAt', 'DESC']]
      })

      if (movimientos.length === 0) {
        return { error: 'No se encontraron movimientos con los filtros aplicados' }
      }

      // Formatear respuesta
      const movimientosFormateados = movimientos.map((mov) => ({
        id: mov.id,
        fecha: mov.createdAt,
        tipo: mov.tipoMovimiento,
        producto: mov.variante.producto.nombre,
        categoria: mov.variante.producto.categoria.nombre,
        talla: mov.variante.talla,
        color: mov.variante.color,
        cantidad: mov.cantidad,
        motivo: mov.motivo,
        documento: mov.documentoRef
      }))

      return movimientosFormateados
    } catch (error) {
      return { error: 'Error al consultar los movimientos', detalle: error.message }
    }
  }

  listarProductos = async (filtros = {}) => {
    try {
      const { categoriaId } = filtros
      const whereConditions = { activo: true }
      if (categoriaId && categoriaId !== '' && categoriaId !== '[object Object]') {
        whereConditions.categoriaId = categoriaId
      }

      const productos = await this.modeloProducto.findAll({
        attributes: ['id', 'nombre', 'marca', 'modelo', 'categoriaId'],
        where: whereConditions,
        include: [{
          model: this.modeloCategoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }],
        order: [['nombre', 'ASC']]
      })

      if (productos.length === 0) {
        return { error: 'No hay productos registrados para esta categoría' }
      }

      return productos
    } catch (error) {
      return { error: 'Error al consultar los productos', detalle: error.message }
    }
  }

  // Método para listar categorías (para filtros)
  listarCategorias = async () => {
    try {
      const categorias = await this.modeloCategoria.findAll({
        attributes: ['id', 'nombre', 'genero'],
        where: { activo: true },
        order: [['nombre', 'ASC']]
      })

      if (categorias.length === 0) {
        return { error: 'No hay categorías registradas' }
      }

      return categorias
    } catch (error) {
      return { error: 'Error al consultar las categorías', detalle: error.message }
    }
  }

  construirCondicionesConsulta = (categoriaId, productoId, conStockBajo, activos) => {
    const whereConditions = {}
    const whereProducto = {}
    const includeConditions = []

    // Filtros por producto y categoría
    if (categoriaId) whereProducto.categoriaId = categoriaId
    if (productoId) whereProducto.id = productoId

    // Filtro por stock bajo
    if (conStockBajo) {
      whereConditions.stockActual = {
        [Op.lte]: this.modeloProductoVariante.sequelize.col('stockMinimo')
      }
    }

    // Filtro por estado activo
    if (activos !== undefined) {
      whereConditions.activo = activos
      whereProducto.activo = activos
    }

    // Configuración de includes
    const configProducto = {
      model: this.modeloProducto,
      as: 'producto',
      attributes: ['id', 'nombre', 'marca', 'modelo'],
      include: [{
        model: this.modeloCategoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    }

    if (Object.keys(whereProducto).length > 0) {
      configProducto.where = whereProducto
    }

    includeConditions.push(configProducto)

    return { whereConditions, includeConditions }
  }

  obtenerVariantesConProductos = async (whereConditions, includeConditions) => {
    return await this.modeloProductoVariante.findAll({
      where: whereConditions,
      include: includeConditions,
      attributes: [
        'id',
        'talla',
        'color',
        'codigo',
        'precioVenta',
        'stockActual',
        'stockMinimo',
        'activo'
      ],
      order: [
        ['producto', 'nombre', 'ASC'],
        ['talla', 'ASC'],
        ['color', 'ASC']
      ]
    })
  }

  calcularEstadisticasInventario = (variantes) => {
    return {
      totalProductos: new Set(variantes.map((v) => v.producto.id)).size,
      totalVariantes: variantes.length,
      stockTotal: variantes.reduce((sum, v) => sum + v.stockActual, 0),
      valorTotalInventario: variantes.reduce(
        (sum, v) => sum + v.stockActual * v.precioVenta, 0
      ),
      productosStockBajo: variantes.filter(
        (v) => v.stockActual <= v.stockMinimo
      ).length
    }
  }

  determinarEstadoStock = (stockActual, stockMinimo) => {
    if (stockActual === 0) return 'SIN_STOCK'
    if (stockActual <= stockMinimo) return 'STOCK_BAJO'
    return 'STOCK_NORMAL'
  }

  mapearInventarioADTO = (variantes) => {
    return variantes.map((variante) => ({
      id: variante.id,
      producto: variante.producto.nombre,
      marca: variante.producto.marca,
      modelo: variante.producto.modelo,
      categoria: variante.producto.categoria.nombre,
      talla: variante.talla,
      color: variante.color,
      codigo: variante.codigo,
      precioVenta: variante.precioVenta,
      stockActual: variante.stockActual,
      stockMinimo: variante.stockMinimo,
      estadoStock: this.determinarEstadoStock(variante.stockActual, variante.stockMinimo),
      valorTotal: variante.stockActual * variante.precioVenta,
      activo: variante.activo
    }))
  }

  ejecutarTipoReporte = async (tipoReporte, filtros, agruparPor) => {
    const estrategiasReporte = {
      DETALLADO: () => this.generarReporteDetallado(filtros),
      RESUMEN: () => this.generarReporteResumen(filtros, agruparPor),
      MOVIMIENTOS: () => this.generarReporteMovimientos(filtros.fechaInicio, filtros.fechaFin),
      STOCK_BAJO: () => this.generarReporteStockBajo()
    }

    const estrategia = estrategiasReporte[tipoReporte.toUpperCase()]
    if (!estrategia) return { error: 'Tipo de reporte no válido' }

    return await estrategia()
  }

  generarReporteDetallado = async (filtros) => {
    const estadoInventario = await this.estadoInventario(filtros)
    return estadoInventario.error
      ? estadoInventario
      : { tipo: 'DETALLADO', ...estadoInventario }
  }

  generarReporteResumen = async (filtros, agruparPor) => {
    const { categoriaId, activos = true } = filtros

    const variantes = await this.obtenerVariantesParaResumen(categoriaId, activos)

    if (variantes.length === 0) {
      return { error: 'No hay datos para generar el reporte' }
    }

    const datosAgrupados = this.ejecutarAgrupacion(agruparPor, variantes)

    if (datosAgrupados.error) return datosAgrupados

    return {
      tipo: 'RESUMEN',
      criterioAgrupacion: agruparPor,
      resumen: datosAgrupados
    }
  }

  generarReporteMovimientos = async (fechaInicio, fechaFin) => {
    const movimientos = await this.movimientosInventario({ fechaInicio, fechaFin })

    if (movimientos.error) return movimientos

    const resumenMovimientos = this.procesarResumenMovimientos(movimientos)

    return {
      tipo: 'MOVIMIENTOS',
      periodo: this.formatearPeriodo(fechaInicio, fechaFin),
      totalMovimientos: movimientos.length,
      resumenPorTipo: resumenMovimientos,
      movimientosDetallados: movimientos
    }
  }

  generarReporteStockBajo = async () => {
    const stockBajo = await this.estadoInventario({ conStockBajo: true })

    if (stockBajo.error) return stockBajo

    const productosCriticos = stockBajo.inventario.filter(
      (item) => item.stockActual === 0
    )

    return {
      tipo: 'STOCK_BAJO',
      totalProductosStockBajo: stockBajo.inventario.length,
      totalProductosSinStock: productosCriticos.length,
      productosStockBajo: stockBajo.inventario,
      productosCriticos
    }
  }

  obtenerVariantesParaResumen = async (categoriaId, activos) => {
    const whereConditions = { activo: activos }
    const whereProducto = {}

    if (categoriaId) whereProducto.categoriaId = categoriaId

    return await this.modeloProductoVariante.findAll({
      where: whereConditions,
      include: [{
        model: this.modeloProducto,
        as: 'producto',
        where: whereProducto,
        attributes: ['id', 'nombre', 'marca'],
        include: [{
          model: this.modeloCategoria,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }]
      }],
      attributes: ['id', 'talla', 'color', 'stockActual', 'precioVenta']
    })
  }

  ejecutarAgrupacion = (agruparPor, variantes) => {
    const estrategiasAgrupacion = {
      CATEGORIA: () => this.agruparPorCategoria(variantes),
      PRODUCTO: () => this.agruparPorProducto(variantes),
      MARCA: () => this.agruparPorMarca(variantes)
    }

    const estrategia = estrategiasAgrupacion[agruparPor.toUpperCase()]
    return estrategia ? estrategia() : { error: 'Criterio de agrupación no válido' }
  }

  procesarResumenMovimientos = (movimientos) => {
    return movimientos.reduce((acc, mov) => {
      if (!acc[mov.tipo]) {
        acc[mov.tipo] = { cantidad: 0, movimientos: [] }
      }
      acc[mov.tipo].cantidad += mov.cantidad
      acc[mov.tipo].movimientos.push(mov)
      return acc
    }, {})
  }

  formatearPeriodo = (fechaInicio, fechaFin) => {
    return fechaInicio && fechaFin ? `${fechaInicio} a ${fechaFin}` : 'TODO'
  }

  agruparPorCategoria = (variantes) => {
    return variantes.reduce((acc, variante) => {
      const categoria = variante.producto.categoria.nombre
      if (!acc[categoria]) {
        acc[categoria] = {
          totalProductos: 0,
          totalVariantes: 0,
          stockTotal: 0,
          valorTotal: 0
        }
      }

      acc[categoria].totalVariantes++
      acc[categoria].stockTotal += variante.stockActual
      acc[categoria].valorTotal += variante.stockActual * variante.precioVenta

      // Contar productos únicos
      if (!acc[categoria].productosUnicos) {
        acc[categoria].productosUnicos = new Set()
      }
      acc[categoria].productosUnicos.add(variante.producto.id)
      acc[categoria].totalProductos = acc[categoria].productosUnicos.size

      return acc
    }, {})
  }

  agruparPorProducto = (variantes) => {
    return variantes.reduce((acc, variante) => {
      const producto = variante.producto.nombre
      if (!acc[producto]) {
        acc[producto] = {
          marca: variante.producto.marca,
          categoria: variante.producto.categoria.nombre,
          totalVariantes: 0,
          stockTotal: 0,
          valorTotal: 0
        }
      }

      acc[producto].totalVariantes++
      acc[producto].stockTotal += variante.stockActual
      acc[producto].valorTotal += variante.stockActual * variante.precioVenta

      return acc
    }, {})
  }

  agruparPorMarca = (variantes) => {
    return variantes.reduce((acc, variante) => {
      const marca = variante.producto.marca
      if (!acc[marca]) {
        acc[marca] = {
          totalProductos: 0,
          totalVariantes: 0,
          stockTotal: 0,
          valorTotal: 0
        }
      }

      acc[marca].totalVariantes++
      acc[marca].stockTotal += variante.stockActual
      acc[marca].valorTotal += variante.stockActual * variante.precioVenta

      // Contar productos únicos
      if (!acc[marca].productosUnicos) {
        acc[marca].productosUnicos = new Set()
      }
      acc[marca].productosUnicos.add(variante.producto.id)
      acc[marca].totalProductos = acc[marca].productosUnicos.size

      return acc
    }, {})
  }
}
