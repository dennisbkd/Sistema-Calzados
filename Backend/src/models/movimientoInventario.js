import { DataTypes } from 'sequelize'
import sequelize from '../../config/baseDatos.js'

export const MovimientoInventario = sequelize.define('MovimientoInventario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipoMovimiento: {
      type: DataTypes.ENUM('ENTRADA_COMPRA',
        'SALIDA_VENTA',
        'ENTRADA_DEVOLUCION',
        'SALIDA_AJUSTE',
        'ENTRADA_AJUSTE'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    documentoRef: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    varianteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ProductoVariante',
        key: 'id'
      }
    },
    compraId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Compra',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Venta',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    }
  },
  {
    timestamps: true,
    tableName: 'MovimientoInventario'
  }
)
