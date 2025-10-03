import React from 'react'

export const EstadoEtiqueta = ({
  activo,
  textos = { activo: "Activo", inactivo: "Inactivo" },
  iconos = { activo: null, inactivo: null }
}) => {
  const IconoActivo = iconos.activo
  const IconoInactivo = iconos.inactivo

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${activo
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
      }`}>
      {activo ? (
        <>
          {IconoActivo && <IconoActivo size={14} />}
          {textos.activo}
        </>
      ) : (
        <>
          {IconoInactivo && <IconoInactivo size={14} />}
          {textos.inactivo}
        </>
      )}
    </span>
  )
}
