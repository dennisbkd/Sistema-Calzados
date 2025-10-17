import { RefreshCcw } from 'lucide-react'
import React from 'react'

export const EstadoEtiqueta = ({
  activo,
  textos,
  isLoading = false,
  iconos = { activo: null, inactivo: null }
}) => {
  const IconoActivo = iconos.activo
  const IconoInactivo = iconos.inactivo

  const mostrarTexto = !!(textos?.activo || textos?.inactivo)

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
    >
      {isLoading ? (
        <div>
          <RefreshCcw className="animate-spin" size={12} />
        </div>
      ) : (
        activo ? (
          <>
            {IconoActivo && <IconoActivo size={14} />}
            {mostrarTexto && textos?.activo && <span>{textos.activo}</span>}
          </>
        ) : (
          <>
            {IconoInactivo && <IconoInactivo size={14} />}
            {mostrarTexto && textos?.inactivo && <span>{textos.inactivo}</span>}
          </>
        )
      )}
    </span >
  )
}