export class ProveedorServicio {
  constructor ({ modeloProveedor }) {
    this.modeloProveedor = modeloProveedor
  }

  async listar () {
    const proveedores = await this.modeloProveedor.findAll()

    return proveedores.map(p => {
      const fecha = new Date(p.createdAt)
      const fechaRegistrada = fecha.toISOString().split('T')[0]
      const hora = fecha.toTimeString().split(' ')[0]

      return {
        id: p.id,
        nombre: p.nombre,
        contacto: p.contacto,
        direccion: p.direccion,
        telefono: p.telefono,
        activo: p.activo,
        fechaRegistrada,
        hora
      }
    })
  }

  async obtener (id) {
    const proveedor = await this.modeloProveedor.findByPk(id)
    if (!proveedor) throw new Error('Proveedor no encontrado')

    const fecha = new Date(proveedor.createdAt)
    return {
      id: proveedor.id,
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      direccion: proveedor.direccion,
      telefono: proveedor.telefono,
      activo: proveedor.activo,
      fechaRegistrada: fecha.toISOString().split('T')[0],
      hora: fecha.toTimeString().split(' ')[0]
    }
  }

  async crear (data) {
    const proveedor = await this.modeloProveedor.create(data)
    return proveedor
  }

  async actualizar (id, data) {
    const proveedor = await this.modeloProveedor.findByPk(id)
    if (!proveedor) throw new Error('Proveedor no encontrado')

    await proveedor.update(data)
    return proveedor
  }

  async eliminar (id) {
    const proveedor = await this.modeloProveedor.findByPk(id)
    if (!proveedor) throw new Error('Proveedor no encontrado')

    await proveedor.destroy()
    return { mensaje: 'Proveedor eliminado correctamente' }
  }

  async toggleEstado (id) {
    const proveedor = await this.modeloProveedor.findByPk(id)
    if (!proveedor) throw new Error('Proveedor no encontrado')

    proveedor.activo = !proveedor.activo
    await proveedor.save()
    return proveedor
  }
}
