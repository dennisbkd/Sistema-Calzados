import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const ProductoVariante = sequelize.define('ProductoVariante',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Producto',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    talla: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    precioCompra: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: true
    },
    precioVenta: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false
    },
    stockActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'ProductoVariante'
  })
