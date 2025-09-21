import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const UbicacionFisica = sequelize.define('UbicacionFisica', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zonaBodegaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ZonaBodega',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacidadMaxima: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'UbicacionFisica',
  indexes: [
    {
      unique: true,
      fields: ['zonaBodegaId', 'codigo']
    }
  ]
})
