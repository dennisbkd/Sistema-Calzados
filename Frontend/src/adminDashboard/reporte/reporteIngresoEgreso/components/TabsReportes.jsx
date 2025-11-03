import { useState } from "react"
import { ShoppingCart, TrendingUp } from "lucide-react"

const TabsReportes = ({ 
  compras, 
  ventas, 
  loadingCompras, 
  loadingVentas,
  onTabChange 
}) => {
  const [tabActivo, setTabActivo] = useState('compras')

  const handleTabChange = (tab) => {
    setTabActivo(tab)
    onTabChange(tab)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => handleTabChange('compras')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            tabActivo === 'compras'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingCart size={18} />
          Compras ({compras.length})
        </button>
        
        <button
          onClick={() => handleTabChange('ventas')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            tabActivo === 'ventas'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp size={18} />
          Ventas ({ventas.length})
        </button>
      </div>

      {/* Contenido de los tabs */}
      <div>
        {tabActivo === 'compras' && (
          <div>
            {/* Aquí irá la tabla de compras */}
            {loadingCompras ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando compras...</p>
              </div>
            ) : (
              <div>
                {/* El componente TablaCompras se renderizará aquí */}
                {compras.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay compras en el periodo seleccionado
                  </div>
                ) : (
                  <div>
                    {/* Espacio para la tabla de compras */}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tabActivo === 'ventas' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ventas del Periodo
            </h3>
            {/* Aquí irá la tabla de ventas */}
            {loadingVentas ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando ventas...</p>
              </div>
            ) : (
              <div>
                {/* El componente TablaVentas se renderizará aquí */}
                {ventas.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay ventas en el periodo seleccionado
                  </div>
                ) : (
                  <div>
                    {/* Espacio para la tabla de ventas */}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TabsReportes