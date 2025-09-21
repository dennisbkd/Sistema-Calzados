import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const TransaccionPago = sequelize.define('TransaccionPago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipoTransaccion: {
    type: DataTypes.ENUM('COMPRA', 'VENTA'),
    allowNull: false
  },
  compraId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Compra',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  ventaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Venta',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  metodoPagoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'MetodoPago',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  referencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'TransaccionPago'
})
