import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const InventarioUbicacion = sequelize.define('InventarioUbicacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ubicacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'UbicacionFisica',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  varianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProductoVariante',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'InventarioUbicacion',
  indexes: [
    {
      unique: true,
      fields: ['ubicacionId', 'varianteId']
    }
  ]
})
