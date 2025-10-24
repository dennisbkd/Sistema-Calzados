import { Op } from 'sequelize'
export class BitacoraServicio {
  constructor ({ modeloBitacora, modeloUsuario, sequelize }) {
    this.modeloBitacora = modeloBitacora
    this.modeloUsuario = modeloUsuario
    this.sequelize = sequelize
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

  // services/bitacoraServicio.js - AGREGAR MÉTODO DE BÚSQUEDA
  buscarEnBitacora = async (termino, filtros = {}) => {
    try {
      const { fechaInicio, fechaFin, limite = 50 } = filtros

      const where = {
        [Op.or]: [
          { tablaAfectada: { [Op.like]: `%${termino}%` } },
          { accion: { [Op.like]: `%${termino}%` } },
          { datosAnteriores: { [Op.like]: `%${termino}%` } },
          { datosNuevos: { [Op.like]: `%${termino}%` } }
        ]
      }

      if (fechaInicio || fechaFin) {
        where.createdAt = {}
        if (fechaInicio) where.createdAt[Op.gte] = new Date(fechaInicio)
        if (fechaFin) where.createdAt[Op.lte] = new Date(fechaFin + ' 23:59:59')
      }

      const resultados = await this.modeloBitacora.findAll({
        where,
        include: [{
          model: this.modeloUsuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }],
        limit: limite,
        order: [['createdAt', 'DESC']]
      })

      return resultados.map(r => r.toJSON())
    } catch (error) {
      console.error('Error en buscarEnBitacora:', error)
      throw new Error('Error al realizar la búsqueda: ' + error.message)
    }
  }

  // NUEVO: Obtener usuarios activos con estadísticas
  obtenerUsuariosActivos = async (filtros = {}) => {
    try {
      const { fechaInicio, fechaFin, pagina = 1, limite = 20 } = filtros
      const offset = (pagina - 1) * limite

      const whereBitacora = {}
      if (fechaInicio || fechaFin) {
        whereBitacora.createdAt = {}
        if (fechaInicio) whereBitacora.createdAt.$gte = new Date(fechaInicio)
        if (fechaFin) whereBitacora.createdAt.$lte = new Date(fechaFin + ' 23:59:59')
      }

      const usuarios = await this.modeloUsuario.findAll({
        attributes: ['id', 'nombre', 'email'],
        include: [{
          model: this.modeloBitacora,
          as: 'bitacoras',
          attributes: ['id', 'accion', 'tablaAfectada', 'createdAt'],
          where: whereBitacora,
          required: false
        }],
        limit: limite,
        offset,
        order: [['nombre', 'ASC']]
      })

      // Procesar estadísticas
      const usuariosConEstadisticas = usuarios.map(usuario => {
        const bitacoras = usuario.bitacoras || []
        const hoy = new Date().toDateString()

        const estadisticas = {
          totalAcciones: bitacoras.length,
          accionesHoy: bitacoras.filter(b =>
            new Date(b.createdAt).toDateString() === hoy
          ).length,
          tablasAfectadas: [...new Set(bitacoras.map(b => b.tablaAfectada))].length,
          ultimaAccion: bitacoras.length > 0
            ? bitacoras[0].createdAt
            : null
        }

        const accionesRecientes = bitacoras
          .slice(0, 3)
          .map(b => ({
            accion: b.accion,
            tabla: b.tablaAfectada,
            registroId: b.registroId,
            timestamp: b.createdAt
          }))

        return {
          id: usuario.id,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            avatar: usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase()
          },
          estadisticas,
          accionesRecientes
        }
      })

      // Obtener total para paginación
      const total = await this.modeloUsuario.count({
        include: [{
          model: this.modeloBitacora,
          as: 'bitacoras',
          where: whereBitacora,
          required: false
        }]
      })

      return {
        usuarios: usuariosConEstadisticas,
        paginacion: {
          total,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          paginas: Math.ceil(total / limite)
        }
      }
    } catch (error) {
      console.error('Error en obtenerUsuariosActivos:', error)
      return { error: 'Error al obtener usuarios activos' }
    }
  }

  // NUEVO: Obtener detalles completos de un usuario
  obtenerDetallesUsuario = async (usuarioId, filtros = {}) => {
    try {
      const { fechaInicio, fechaFin, tabla, pagina = 1, limite = 50 } = filtros
      const offset = (pagina - 1) * limite

      const where = { usuarioId }
      if (fechaInicio || fechaFin) {
        where.createdAt = {}
        if (fechaInicio) where.createdAt.$gte = new Date(fechaInicio)
        if (fechaFin) where.createdAt.$lte = new Date(fechaFin + ' 23:59:59')
      }
      if (tabla) where.tablaAfectada = tabla

      const usuario = await this.modeloUsuario.findByPk(usuarioId, {
        attributes: ['id', 'nombre', 'email']
      })

      if (!usuario) {
        return { error: 'Usuario no encontrado' }
      }

      const { count, rows: movimientos } = await this.modeloBitacora.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: limite,
        offset
      })

      return {
        usuario: {
          ...usuario.toJSON(),
          avatar: usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase(),
          rol: 'Usuario' // Podrías obtener esto de la relación con Roles
        },
        movimientos: movimientos.map(m => m.toJSON()),
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          paginas: Math.ceil(count / limite)
        }
      }
    } catch (error) {
      console.error('Error en obtenerDetallesUsuario:', error)
      return { error: 'Error al obtener detalles del usuario' }
    }
  }

  // NUEVO: Obtener estadísticas generales
  obtenerEstadisticas = async (filtros = {}) => {
    try {
      const { fechaInicio, fechaFin } = filtros

      const where = {}
      if (fechaInicio || fechaFin) {
        where.createdAt = {}
        if (fechaInicio) where.createdAt.$gte = new Date(fechaInicio)
        if (fechaFin) where.createdAt.$lte = new Date(fechaFin + ' 23:59:59')
      }

      const totalRegistros = await this.modeloBitacora.count({ where })

      const usuariosActivos = await this.modeloBitacora.count({
        where,
        distinct: true,
        col: 'usuarioId'
      })

      const tablasAfectadas = await this.modeloBitacora.count({
        where,
        distinct: true,
        col: 'tablaAfectada'
      })

      // Acciones de hoy
      const hoyInicio = new Date()
      hoyInicio.setHours(0, 0, 0, 0)
      const hoyFin = new Date()
      hoyFin.setHours(23, 59, 59, 999)

      const accionesHoy = await this.modeloBitacora.count({
        where: {
          createdAt: {
            $between: [hoyInicio, hoyFin]
          }
        }
      })

      return {
        totalRegistros,
        usuariosActivos,
        tablasAfectadas,
        accionesHoy
      }
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error)
      return { error: 'Error al obtener estadísticas' }
    }
  }

  obtenerEstadisticasAvanzadas = async (filtros = {}) => {
    try {
      const { fechaInicio, fechaFin } = filtros

      const where = {}
      if (fechaInicio || fechaFin) {
        where.createdAt = {}
        if (fechaInicio) where.createdAt[Op.gte] = new Date(fechaInicio)
        if (fechaFin) where.createdAt[Op.lte] = new Date(fechaFin + ' 23:59:59')
      }

      // 1. Distribución por tipo de acción
      const distribucionAcciones = await this.modeloBitacora.findAll({
        where,
        attributes: [
          'accion',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'total']
        ],
        group: ['accion'],
        raw: true
      })

      // 2. Actividad por hora del día
      const actividadPorHora = await this.modeloBitacora.findAll({
        where,
        attributes: [
          [this.sequelize.fn('HOUR', this.sequelize.col('createdAt')), 'hora'],
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'total']
        ],
        group: [this.sequelize.fn('HOUR', this.sequelize.col('createdAt'))],
        order: [[this.sequelize.fn('HOUR', this.sequelize.col('createdAt')), 'ASC']],
        raw: true
      })

      // 3. Tablas más activas
      const tablasActivas = await this.modeloBitacora.findAll({
        where,
        attributes: [
          'tablaAfectada',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'totalAcciones'],
          [this.sequelize.literal(`(
          SELECT COUNT(*) 
          FROM Bitacora AS b2 
          WHERE b2.tablaAfectada = Bitacora.tablaAfectada 
          AND b2.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        )`), 'accionesRecientes']
        ],
        group: ['tablaAfectada'],
        order: [[this.sequelize.literal('totalAcciones'), 'DESC']],
        limit: 10,
        raw: true
      })

      // Procesar datos para la UI
      const distribucionProcesada = distribucionAcciones.map(item => ({
        accion: item.accion,
        total: parseInt(item.total),
        porcentaje: 0 // Se calculará después
      }))

      // Calcular porcentajes
      const totalAcciones = distribucionProcesada.reduce((sum, item) => sum + item.total, 0)
      distribucionProcesada.forEach(item => {
        item.porcentaje = totalAcciones > 0 ? Math.round((item.total / totalAcciones) * 100) : 0
      })

      // Procesar actividad por hora
      const actividadProcesada = Array.from({ length: 24 }, (_, i) => {
        const horaData = actividadPorHora.find(h => parseInt(h.hora) === i)
        const total = horaData ? parseInt(horaData.total) : 0
        const maxActividad = Math.max(...actividadPorHora.map(h => parseInt(h.total)), 1)
        return {
          hora: `${i.toString().padStart(2, '0')}:00-${(i + 2).toString().padStart(2, '0')}:00`,
          actividad: total,
          porcentaje: Math.round((total / maxActividad) * 100)
        }
      }).filter(h => h.actividad > 0) // Solo mostrar horas con actividad

      // Procesar tablas activas
      const tablasProcesadas = tablasActivas.map((tabla, index) => {
        const accionesRecientes = parseInt(tabla.accionesRecientes || 0)
        const accionesTotales = parseInt(tabla.totalAcciones)
        const tendencia = index < 2 ? 'up' : accionesRecientes > accionesTotales * 0.1 ? 'stable' : 'down'

        return {
          tabla: tabla.tablaAfectada,
          acciones: accionesTotales,
          tendencia
        }
      })

      return {
        distribucionAcciones: distribucionProcesada,
        actividadPorHora: actividadProcesada.slice(0, 8), // Mostrar solo las 8 horas más activas
        tablasActivas: tablasProcesadas
      }
    } catch (error) {
      console.error('Error en obtenerEstadisticasAvanzadas:', error)
      return { error: 'Error al obtener estadísticas avanzadas' }
    }
  }

  // Método unificado que combine todo
  obtenerEstadisticasCompletas = async (filtros = {}) => {
    try {
      const [basicas, avanzadas] = await Promise.all([
        this.obtenerEstadisticas(filtros),
        this.obtenerEstadisticasAvanzadas(filtros)
      ])

      if (basicas.error) return basicas
      if (avanzadas.error) return avanzadas

      return {
        ...basicas,
        ...avanzadas
      }
    } catch (error) {
      console.error('Error en obtenerEstadisticasCompletas:', error)
      return { error: 'Error al obtener estadísticas completas' }
    }
  }
}
