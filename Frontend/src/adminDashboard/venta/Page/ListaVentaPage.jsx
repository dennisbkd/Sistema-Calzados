// pages/ListaVentas.jsx
import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useListarVentas } from "../hooks/useVentaQuery";
import { Link } from "react-router";

export const ListaVentas = () => {
  // Estados para filtros y paginación
  const [filtros, setFiltros] = useState({
    pagina: 1,
    limite: 10,
    estado: '',
    fechaInicio: '',
    fechaFin: '',
    nroFactura: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const { data: respuestaVentas, isLoading, error, isFetching } = useListarVentas(filtros);

  const ventas = respuestaVentas?.ventas || [];
  const paginacion = {
    total: respuestaVentas?.total || 0,
    pagina: respuestaVentas?.pagina || 1,
    totalPaginas: respuestaVentas?.totalPaginas || 1
  };

  // Manejar cambio de filtros
  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value,
      pagina: 1 // Resetear a primera página cuando cambian filtros
    }));
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      pagina: 1,
      limite: 10,
      estado: '',
      fechaInicio: '',
      fechaFin: '',
      nroFactura: ''
    });
  };

  // Navegación de páginas
  const irAPagina = (pagina) => {
    setFiltros(prev => ({ ...prev, pagina }));
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear moneda
  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  };

  // Obtener badge de estado
  const getEstadoBadge = (estado) => {
    const config = {
      PAGADA: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      REGISTRADA: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
      ANULADA: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
    };

    const estadoConfig = config[estado] || config.REGISTRADA;
    const Icono = estadoConfig.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${estadoConfig.color}`}>
        <Icono className="w-3 h-3" />
        {estado}
      </span>
    );
  };

  // Exportar datos (simulado)
  const handleExportar = () => {
    toast.success('Funcionalidad de exportación en desarrollo');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar ventas</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h1>
              <p className="text-gray-600">Visualiza y gestiona todas las ventas del sistema</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportar}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Búsqueda por número de factura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Factura
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filtros.nroFactura}
                    onChange={(e) => handleFiltroChange('nroFactura', e.target.value)}
                    placeholder="Ej: FACT-20250935"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="PAGADA">Pagada</option>
                  <option value="REGISTRADA">Registrada</option>
                  <option value="ANULADA">Anulada</option>
                </select>
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Fecha fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Acciones de filtros */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {paginacion.total > 0 && `${paginacion.total} ventas encontradas`}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setMostrarFiltros(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tarjeta de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900">{paginacion.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Pagadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {ventas.filter(v => v.estado === 'PAGADA').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {ventas.filter(v => v.estado === 'REGISTRADA').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de ventas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header de la tabla */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Lista de Ventas</h2>
              {isFetching && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Actualizando...
                </div>
              )}
            </div>
          </div>

          {/* Contenido de la tabla */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando ventas...</p>
            </div>
          ) : ventas.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ventas</h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filtros).some(val => val !== '' && val !== 1 && val !== 10)
                  ? "Intenta ajustar los filtros para ver más resultados"
                  : "No hay ventas registradas en el sistema"
                }
              </p>
              {Object.values(filtros).some(val => val !== '' && val !== 1 && val !== 10) && (
                <button
                  onClick={limpiarFiltros}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-900">Factura</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Cliente</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Fecha</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Estado</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Subtotal</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Descuento</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Total</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((venta) => (
                      <tr key={venta.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{venta.nroFactura}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{venta.cliente?.nombre}</span>
                          </div>
                          <div className="text-sm text-gray-500">{venta.cliente?.contacto}</div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatearFecha(venta.createdAt)}
                        </td>
                        <td className="p-4">
                          {getEstadoBadge(venta.estado)}
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatearMoneda(parseFloat(venta.subtotal))}
                        </td>
                        <td className="p-4 text-red-600">
                          -{formatearMoneda(parseFloat(venta.descuento))}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">
                            {formatearMoneda(parseFloat(venta.total))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link to={`/home/ventas/detalle/${venta.id}`}>
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => toast.success(`Descargar ${venta.nroFactura}`)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Descargar factura"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {paginacion.totalPaginas > 1 && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Mostrando {(filtros.pagina - 1) * filtros.limite + 1} -{' '}
                      {Math.min(filtros.pagina * filtros.limite, paginacion.total)} de{' '}
                      {paginacion.total} ventas
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => irAPagina(paginacion.pagina - 1)}
                        disabled={paginacion.pagina === 1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: Math.min(5, paginacion.totalPaginas) }, (_, i) => {
                        let paginaNum;
                        if (paginacion.totalPaginas <= 5) {
                          paginaNum = i + 1;
                        } else if (paginacion.pagina <= 3) {
                          paginaNum = i + 1;
                        } else if (paginacion.pagina >= paginacion.totalPaginas - 2) {
                          paginaNum = paginacion.totalPaginas - 4 + i;
                        } else {
                          paginaNum = paginacion.pagina - 2 + i;
                        }

                        return (
                          <button
                            key={paginaNum}
                            onClick={() => irAPagina(paginaNum)}
                            className={`w-10 h-10 rounded-lg font-medium ${paginacion.pagina === paginaNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {paginaNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => irAPagina(paginacion.pagina + 1)}
                        disabled={paginacion.pagina === paginacion.totalPaginas}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};