import { Menu, X } from 'lucide-react'

export const FiltrarFIlas = ({
  children,
  menuFiltrosAbierto,
  onToggleMenu,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Botón para mostrar/ocultar filtros en móvil */}
      <div className="sm:hidden">
        <button
          onClick={onToggleMenu}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
        >
          {menuFiltrosAbierto ? <X size={18} /> : <Menu size={18} />}
          Filtros
        </button>
      </div>

      {/* Contenedor de filtros */}
      <div className={`
        flex flex-col sm:flex-row gap-3 w-full
        ${menuFiltrosAbierto ? 'flex' : 'hidden sm:flex'}
      `}>
        {children}
      </div>
    </div>
  )
}
