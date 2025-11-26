import { useState, useRef, useEffect } from "react"
import { Download, Printer, ChevronDown, FileSpreadsheet } from "lucide-react"

export const MenuExportar = ({ 
  onDescargarPDF, 
  onImprimir, 
  onDescargarExcel, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDescargarPDF = () => {
    onDescargarPDF()
    setIsOpen(false)
  }

  const handleImprimir = () => {
    onImprimir()
    setIsOpen(false)
  }

  const handleDescargarExcel = () => {
    onDescargarExcel()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download size={18} />
        Exportar
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]">
          <button
            onClick={handleDescargarPDF}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Download size={16} />
            Descargar PDF
          </button>
          
          <button
            onClick={handleDescargarExcel}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          >
            <FileSpreadsheet size={16} />
            Descargar Excel
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={handleImprimir}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Printer size={16} />
            Imprimir
          </button>
        </div>
      )}
    </div>
  )
}