"use client"

import { motion } from "motion/react"
import { Package, BarChart3, History } from "lucide-react"

const TabsInventario = ({ tabActivo, onTabChange }) => {
  const tabs = [
    { id: 'estado', label: 'Estado del Inventario', icon: Package },
    { id: 'reporte', label: 'Generar Reportes', icon: BarChart3 },
    { id: 'movimientos', label: 'Movimientos', icon: History }
  ]

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {tabs.map((tab) => {
        const IconComponent = tab.icon
        const isActive = tabActivo === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <IconComponent size={18} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default TabsInventario