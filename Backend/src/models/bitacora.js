import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Bitacora = sequelize.define('Bitacora',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    accion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tablaAfectada: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    registroId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    datosAnteriores: {
      type: DataTypes.JSON,
      allowNull: true
    },
    datosNuevos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    timestamps: true,
    updatedAt: false,
    tableName: 'Bitacora'
  })
