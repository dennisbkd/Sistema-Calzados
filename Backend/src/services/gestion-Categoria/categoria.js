export class CategoriaServicio {
  constructor ({ modeloCategoria }) {
    this.modeloCategoria = modeloCategoria
  }

  // Listar todas las categorías
  listar = async () => {
    try {
      const categorias = await this.modeloCategoria.findAll({
        attributes: ['id', 'nombre', 'descripcion', 'genero', 'activo', 'createdAt']
      })

      if (categorias.length === 0) return { error: 'No hay categorías registradas' }

      const categoriasDto = categorias.map(cat => {
        const hora = new Date(cat.createdAt).toISOString().substring(11, 16)
        const fecha = cat.createdAt.toISOString().split('T')[0]

        return {
          id: cat.id,
          nombre: cat.nombre,
          descripcion: cat.descripcion,
          genero: cat.genero,
          activo: cat.activo,
          fechaRegistro: fecha,
          hora
        }
      })

      return categoriasDto
    } catch (e) {
      console.error(e)
      return { error: 'Error al consultar categorías', e }
    }
  }

  // Obtener una categoría por ID
  obtener = async (id) => {
    try {
      const cat = await this.modeloCategoria.findByPk(id, {
        attributes: ['id', 'nombre', 'descripcion', 'genero', 'activo', 'createdAt']
      })
      if (!cat) return { error: 'Categoría no encontrada' }

      const hora = new Date(cat.createdAt).toISOString().substring(11, 16)
      const fecha = cat.createdAt.toISOString().split('T')[0]

      return {
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        genero: cat.genero,
        activo: cat.activo,
        fechaRegistro: fecha,
        hora
      }
    } catch (e) {
      console.error(e)
      return { error: 'Error al consultar la categoría', e }
    }
  }

  // Crear categoría
  crear = async ({ nombre, descripcion, genero }) => {
    try {
      const nueva = await this.modeloCategoria.create({ nombre, descripcion, genero, activo: true })

      const hora = new Date(nueva.createdAt).toISOString().substring(11, 16)
      const fecha = nueva.createdAt.toISOString().split('T')[0]

      return {
        id: nueva.id,
        nombre: nueva.nombre,
        descripcion: nueva.descripcion,
        genero: nueva.genero,
        activo: nueva.activo,
        fechaRegistro: fecha,
        hora
      }
    } catch (e) {
      console.error(e)
      return { error: 'Error al crear la categoría', e }
    }
  }

  // Actualizar categoría
  actualizar = async (id, { nombre, descripcion, genero }) => {
    try {
      const cat = await this.modeloCategoria.findByPk(id)
      if (!cat) return { error: 'Categoría no encontrada' }

      await cat.update({ nombre, descripcion, genero })

      const hora = new Date(cat.createdAt).toISOString().substring(11, 16)
      const fecha = cat.createdAt.toISOString().split('T')[0]

      return {
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        genero: cat.genero,
        activo: cat.activo,
        fechaRegistro: fecha,
        hora
      }
    } catch (e) {
      console.error(e)
      return { error: 'Error al actualizar la categoría', e }
    }
  }

  // Toggle de estado (activo/inactivo)
  toggleEstado = async (id) => {
    try {
      const cat = await this.modeloCategoria.findByPk(id)
      if (!cat) return { error: 'Categoría no encontrada' }

      await cat.update({ activo: !cat.activo })
      return { mensaje: `Estado de la categoría actualizado a ${cat.activo ? 'Activo' : 'Inactivo'}` }
    } catch (e) {
      console.error(e)
      return { error: 'Error al cambiar estado de la categoría', e }
    }
  }

  // Eliminar categoría
  eliminar = async (id) => {
    try {
      const cat = await this.modeloCategoria.findByPk(id)
      if (!cat) return { error: 'Categoría no encontrada' }

      await cat.destroy()
      return { mensaje: 'Categoría eliminada correctamente' }
    } catch (e) {
      console.error(e)
      return { error: 'Error al eliminar categoría', e }
    }
  }
}
