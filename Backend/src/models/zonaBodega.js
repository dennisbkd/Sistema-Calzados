import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const ZonaBodega = sequelize.define('ZonaBodega', {
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
  layout_config: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: false,
    defaultValue: '#3B82F6'
  },
  icono: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'warehouse'
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'ZonaBodega'
})
// layout_config JSON DEFAULT NULL,
// color VARCHAR(7) DEFAULT '#3B82F6',
// icono VARCHAR(50) DEFAULT 'warehouse',
