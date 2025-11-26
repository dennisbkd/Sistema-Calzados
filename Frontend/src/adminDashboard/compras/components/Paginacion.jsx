import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const Paginacion = ({
  paginaActual,
  totalPaginas,
  setPaginaActual,
  posicion = "inferior"
}) => {
  const paginasParaMostrar = () => {
    const paginas = []
    const paginasTotales = totalPaginas
    const paginaActualNum = paginaActual

    paginas.push(1)

    for (let i = Math.max(2, paginaActualNum - 1); i <= Math.min(paginasTotales - 1, paginaActualNum + 1); i++) {
      if (!paginas.includes(i)) paginas.push(i)
    }

    if (paginasTotales > 1) {
      paginas.push(paginasTotales)
    }

    return [...new Set(paginas)].sort((a, b) => a - b)
  }

  const irAPagina = (pagina) => {
    setPaginaActual(pagina)
  }

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1)
    }
  }

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1)
    }
  }

  const irAPrimeraPagina = () => {
    setPaginaActual(1)
  }

  const irAUltimaPagina = () => {
    setPaginaActual(totalPaginas)
  }

  if (posicion === "superior") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={irAPrimeraPagina}
          disabled={paginaActual === 1}
          className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Primera página"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={paginaAnterior}
          disabled={paginaActual === 1}
          className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {paginasParaMostrar().map((pagina, index) => (
            <div key={pagina} className="flex items-center">
              {index > 0 && paginasParaMostrar()[index - 1] !== pagina - 1 && (
                <span className="px-1 text-gray-400">...</span>
              )}
              <button
                onClick={() => irAPagina(pagina)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pagina === paginaActual
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                  }`}
              >
                {pagina}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={paginaSiguiente}
          disabled={paginaActual === totalPaginas}
          className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={irAUltimaPagina}
          disabled={paginaActual === totalPaginas}
          className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          title="Última página"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    )
  }

  // Paginación inferior
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={irAPrimeraPagina}
        disabled={paginaActual === 1}
        className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
      >
        <ChevronsLeft size={16} />
        <span className="hidden sm:inline">Primera</span>
      </button>

      <button
        onClick={paginaAnterior}
        disabled={paginaActual === 1}
        className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-1 mx-2">
        <span className="text-sm text-gray-600">Página</span>
        <span className="font-semibold">{paginaActual}</span>
        <span className="text-sm text-gray-600">de</span>
        <span className="font-semibold">{totalPaginas}</span>
      </div>

      <button
        onClick={paginaSiguiente}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={16} />
      </button>

      <button
        onClick={irAUltimaPagina}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm"
      >
        <span className="hidden sm:inline">Última</span>
        <ChevronsRight size={16} />
      </button>
    </div>
  )
}

export default Paginacion