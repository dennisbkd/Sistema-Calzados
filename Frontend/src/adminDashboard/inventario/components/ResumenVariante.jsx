import { CheckCircle, ListChecks, Box, Sparkles } from "lucide-react"

export const ResumenVariante = ({ variante, ultimoMovimiento }) => {
  const stockActual = ultimoMovimiento?.stockActual ?? variante?.stockActual ?? 0
  const detalleDisponible = Boolean(variante)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">Nota de salida</span>
          <h3 className="text-xl font-bold text-gray-800">
            {detalleDisponible ? variante.productoNombre : "Selecciona una variante"}
          </h3>
          {detalleDisponible && (
            <p className="text-sm text-gray-500">
              {variante.marca ? `${variante.marca} · ${variante.categoria}` : ""}
            </p>
          )}
        </div>
        {ultimoMovimiento && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full text-xs font-semibold">
            <CheckCircle size={16} />
            Nota registrada
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Stock actual</p>
          <p className="text-3xl font-semibold text-blue-600">{stockActual}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Codigo</p>
          <p className="text-lg font-semibold text-gray-700">{variante?.codigo ?? "-"}</p>
        </div>
      </div>

      {detalleDisponible && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Box className="text-blue-500" size={16} />
            <span>Talla: <strong>{variante.talla || "Unica"}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="text-blue-500" size={16} />
            <span>Color: <strong>{variante.color || "N/A"}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ListChecks className="text-blue-500" size={16} />
            <span>Activo: <strong>{variante.activo ? "Si" : "No"}</strong></span>
          </div>
        </div>
      )}

      {ultimoMovimiento && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 space-y-1">
          <p className="font-semibold text-gray-800">{ultimoMovimiento.mensaje}</p>
          <p>Cantidad: {ultimoMovimiento.cantidad}</p>
          <p>Motivo: {ultimoMovimiento.motivo}</p>
        </div>
      )}
    </div>
  )
}
