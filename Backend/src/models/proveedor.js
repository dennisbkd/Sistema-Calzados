import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Proveedor = sequelize.define('Proveedor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefono: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'Proveedor'
  })
