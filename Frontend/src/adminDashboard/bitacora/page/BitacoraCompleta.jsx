import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Users,
  BarChart3,
  Search,
  Database
} from 'lucide-react'

import VistaUsuariosActivos from '../components/VistaUsuariosActivos'
import VistaEstadisticas from '../components/VistaEstadisticas'
import VistaBusquedaAvanzada from '../components/VistaBusquedaAvanzada'

const BitacoraCompleta = () => {
  const [tabActiva, setTabActiva] = useState('usuarios')
  const [filtrosGlobales, setFiltrosGlobales] = useState({
    fechaInicio: '',
    fechaFin: ''
  })

  const tabs = [
    { id: 'usuarios', nombre: 'Usuarios Activos', icono: Users },
    { id: 'estadisticas', nombre: 'Estadísticas', icono: BarChart3 },
    { id: 'busqueda', nombre: 'Búsqueda Avanzada', icono: Search }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bitácora del Sistema
              </h1>
              <p className="text-gray-600">
                Monitor completo de todas las actividades y cambios en el sistema
              </p>
            </div>

            {/* Filtros Globales */}
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Desde"
                  value={filtrosGlobales.fechaInicio}
                  onChange={(e) => setFiltrosGlobales(prev => ({ ...prev, fechaInicio: e.target.value }))}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Hasta"
                  value={filtrosGlobales.fechaFin}
                  onChange={(e) => setFiltrosGlobales(prev => ({ ...prev, fechaFin: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Tabs de Navegación */}
          <div className="flex space-x-1 mt-6 border-b border-gray-200">
            {tabs.map((tab) => {
              const IconoTab = tab.icono
              const estaActiva = tabActiva === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${estaActiva
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <IconoTab size={16} />
                  <span className="font-medium">{tab.nombre}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Contenido de Tabs */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {tabActiva === 'usuarios' && (
              <motion.div
                key="usuarios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <VistaUsuariosActivos filtrosGlobales={filtrosGlobales} />
              </motion.div>
            )}

            {tabActiva === 'estadisticas' && (
              <motion.div
                key="estadisticas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <VistaEstadisticas filtrosGlobales={filtrosGlobales} />
              </motion.div>
            )}

            {tabActiva === 'busqueda' && (
              <motion.div
                key="busqueda"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <VistaBusquedaAvanzada filtrosGlobales={filtrosGlobales} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default BitacoraCompleta