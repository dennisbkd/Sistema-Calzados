import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const Promocion = sequelize.define('Promocion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('PORCENTAJE', 'MONTO_FIJO', '2X1', '3X2'),
    allowNull: false
  },
  valorDescuento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  aplicaCategoria: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  aplicaProducto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Producto',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  aplicaTodo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'Promocion'
})
