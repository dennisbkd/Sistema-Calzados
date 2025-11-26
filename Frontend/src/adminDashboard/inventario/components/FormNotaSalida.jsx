import { AlertTriangle, Check } from "lucide-react"
import { BotonAccion } from "../../../global/components/Boton/BotonAccion"

export const FormNotaSalida = ({
  variantes,
  selectedVariantId,
  cantidad,
  motivo,
  documentoRef,
  onVariantChange,
  onCantidadChange,
  onMotivoChange,
  onDocumentoRefChange,
  onSubmit,
  isSubmitting,
  errorMessage,
  stockDisponible,
  motivosRapidos
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border border-blue-50 p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Variante</label>
        <select
          className="w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={selectedVariantId}
          onChange={(event) => onVariantChange(event.target.value)}
        >
          <option value="">Selecciona una variante del inventario</option>
          {variantes.map((variante) => (
            <option key={variante.id} value={variante.id}>
              {`${variante.productoNombre} - ${variante.color || "N/A"} - ${variante.talla || "Unica"}`}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          Stock disponible: <span className="font-semibold">{stockDisponible ?? "-"}</span> unidades
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Cantidad a retirar</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(event) => onCantidadChange(event.target.value)}
            placeholder="Ej. 5"
            className="w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Documento de referencia (opcional)</label>
          <input
            type="text"
            value={documentoRef}
            onChange={(event) => onDocumentoRefChange(event.target.value)}
            placeholder="Ingresar guia, comprobante o folio"
            className="w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Motivo de la salida</label>
        <div className="flex flex-wrap gap-2">
          {motivosRapidos.map((motivoRapido) => (
            <button
              type="button"
              key={motivoRapido}
              onClick={() => onMotivoChange(motivoRapido)}
              className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition uppercase tracking-wide"
            >
              {motivoRapido}
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={motivo}
          onChange={(event) => onMotivoChange(event.target.value)}
          placeholder="Describe brevemente por que se registra esta salida (ej: donacion para obra social, merma de temporada, uso interno)"
          className="w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <AlertTriangle size={18} />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end">
        <BotonAccion
          icon={Check}
          label="Registrar nota de salida"
          variant="primary"
          disabled={!selectedVariantId}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  )
}
