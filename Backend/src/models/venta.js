import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Venta = sequelize.define('Venta',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nroFactura: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    descuento: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('REGISTRADA', 'PAGADA', 'ANULADA'),
      defaultValue: 'REGISTRADA'
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Cliente',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    }
  },
  {
    timestamps: true,
    tableName: 'Venta'
  })
