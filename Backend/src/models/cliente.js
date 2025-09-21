import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Cliente = sequelize.define('Cliente',
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
    ci: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Cliente'
  })
