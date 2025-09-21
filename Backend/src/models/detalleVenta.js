import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const DetalleVenta = sequelize.define('DetalleVenta',
  {
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
    varianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProductoVariante',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'DetalleVenta'
  })
