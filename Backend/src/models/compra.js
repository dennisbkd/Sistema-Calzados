import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Compra = sequelize.define('Compra',
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
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    estado: {
      type: DataTypes.ENUM('REGISTRADA', 'PAGADA', 'ANULADA'),
      allowNull: false,
      defaultValue: 'REGISTRADA'
    },
    proveedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Proveedor',
        key: 'id'
      }
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
    tableName: 'Compra'
  })
