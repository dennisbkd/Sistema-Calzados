import { Calendar, Filter } from "lucide-react"

const FiltrosReportes = ({
  fechaInicio,
  fechaFin,
  onFechaInicioChange,
  onFechaFinChange,
  onGenerarReporte,
  onLimpiarReporte,
  loading
}) => {
  // Generar opciones de años (2023-2026)
  const años = [2023, 2024, 2025, 2026]
  const meses = [
    { valor: '01', nombre: 'Enero' }, { valor: '02', nombre: 'Febrero' },
    { valor: '03', nombre: 'Marzo' }, { valor: '04', nombre: 'Abril' },
    { valor: '05', nombre: 'Mayo' }, { valor: '06', nombre: 'Junio' },
    { valor: '07', nombre: 'Julio' }, { valor: '08', nombre: 'Agosto' },
    { valor: '09', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre' },
    { valor: '11', nombre: 'Noviembre' }, { valor: '12', nombre: 'Diciembre' }
  ]

  // Obtener partes de la fecha
  const getPartesFecha = (fecha) => {
    const [año, mes, dia] = fecha.split('-')
    return { año, mes, dia }
  }

  const fechaInicioPartes = getPartesFecha(fechaInicio)
  const fechaFinPartes = getPartesFecha(fechaFin)

  const actualizarFecha = (tipo, campo, valor) => {
    const partes = tipo === 'inicio' ? getPartesFecha(fechaInicio) : getPartesFecha(fechaFin)
    const nuevaFecha = `${campo === 'año' ? valor : partes.año}-${
      campo === 'mes' ? valor : partes.mes
    }-${campo === 'dia' ? valor.padStart(2, '0') : partes.dia}`
    
    if (tipo === 'inicio') {
      onFechaInicioChange(nuevaFecha)
    } else {
      onFechaFinChange(nuevaFecha)
    }
  }

  // Generar días según el mes y año
  const getDiasDelMes = (año, mes) => {
    return new Date(parseInt(año), parseInt(mes), 0).getDate()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Filter className="text-blue-600" size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Filtrar por Periodo</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Fecha Inicio</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={fechaInicioPartes.año}
              onChange={(e) => actualizarFecha('inicio', 'año', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {años.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
            
            <select
              value={fechaInicioPartes.mes}
              onChange={(e) => actualizarFecha('inicio', 'mes', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map(mes => (
                <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
              ))}
            </select>
            
            <select
              value={fechaInicioPartes.dia}
              onChange={(e) => actualizarFecha('inicio', 'dia', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[...Array(getDiasDelMes(fechaInicioPartes.año, fechaInicioPartes.mes))].map((_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Fecha Fin</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={fechaFinPartes.año}
              onChange={(e) => actualizarFecha('fin', 'año', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {años.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
            
            <select
              value={fechaFinPartes.mes}
              onChange={(e) => actualizarFecha('fin', 'mes', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map(mes => (
                <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
              ))}
            </select>
            
            <select
              value={fechaFinPartes.dia}
              onChange={(e) => actualizarFecha('fin', 'dia', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[...Array(getDiasDelMes(fechaFinPartes.año, fechaFinPartes.mes))].map((_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onGenerarReporte}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Calendar size={18} />
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
        
        <button
          onClick={onLimpiarReporte}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}

export default FiltrosReportes