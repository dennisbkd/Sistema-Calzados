import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const VentaPromocion = sequelize.define('VentaPromocion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ventaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Venta',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  promocionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Promocion',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  montoDescuento: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: false,
  tableName: 'VentaPromocion',
  indexes: [
    {
      unique: true,
      fields: ['ventaId', 'promocionId'],
      name: 'unique_venta_promocion'
    }
  ]
})
