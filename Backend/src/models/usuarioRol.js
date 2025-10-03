import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const UsuarioRol = sequelize.define('UsuarioRol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario', // nombre de la tabla o modelo
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  rolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rol',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true, // Sequelize maneja createdAt y updatedAt automáticamente
  tableName: 'UsuarioRol',
  indexes: [
    {
      unique: true,
      fields: ['usuarioId', 'rolId'],
      name: 'unique_usuario_rol'
    }
  ]
})
