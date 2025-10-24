export class CategoriaServicio {
  constructor({ modeloCategoria }) {
    this.modeloCategoria = modeloCategoria
  }

  // Listar todas las categorías
  listar = async () => {
    try {
      const categorias = await this.modeloCategoria.findAll({
        attributes: ['id', 'nombre', 'descripcion', 'genero', 'activo', 'createdAt']
      })

      //Retornar array vacío en lugar de objeto con error
      if (categorias.length === 0) return []

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
      console.error('Error al consultar categorías:', e)
      // En caso de error real de base de datos, retornar array vacío
      return []
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
      console.error('Error al consultar la categoría:', e)
      return { error: 'Error al consultar la categoría' }
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
      console.error('Error al crear la categoría:', e)
      return { error: 'Error al crear la categoría' }
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
      console.error('Error al actualizar la categoría:', e)
      return { error: 'Error al actualizar la categoría' }
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
      console.error('Error al cambiar estado de la categoría:', e)
      return { error: 'Error al cambiar estado de la categoría' }
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
      console.error('Error al eliminar categoría:', e)
      return { error: 'Error al eliminar categoría' }
    }
  }
}