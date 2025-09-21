import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const DetalleCompra = sequelize.define('DetalleCompra',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    compraId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Compra',
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
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 1
      }
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'DetalleCompra'
  })
