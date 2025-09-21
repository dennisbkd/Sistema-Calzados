import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Producto = sequelize.define('Producto',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categoria',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }

  },
  {
    timestamps: true,
    tableName: 'Producto'
  })
