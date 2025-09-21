import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Categoria = sequelize.define('Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    genero: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    timestamps: true,
    tableName: 'Categoria'
  })
