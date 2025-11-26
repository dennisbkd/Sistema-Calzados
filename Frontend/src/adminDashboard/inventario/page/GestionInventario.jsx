import { motion } from "motion/react"
import { useMemo, useState } from "react"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"
import { useProducto } from "../../producto.jsx/hook/query/useProductoQuery"
import { useRegistrarNotaSalida } from "../hook/useNotaSalida"
import { useHistorialNotasSalida } from "../hook/useHistorialNotasSalida"
import { FormNotaSalida } from "../components/FormNotaSalida"
import { ResumenVariante } from "../components/ResumenVariante"

const MOTIVOS_SUGERIDOS = [
  "Mermas por almacenamiento",
  "Donacion social",
  "Uso interno",
  "Devolucion a fabrica",
  "Descarte/merma"
]

const formatFecha = (value) => {
  if (!value) return "-"
  return new Date(value).toLocaleString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const describirVariante = (variante) => {
  if (!variante) return "Variante eliminada"
  const partes = [
    variante.producto?.nombre,
    variante.color,
    variante.talla ? `Talla ${variante.talla}` : null,
    variante.codigo && `Codigo ${variante.codigo}`
  ].filter(Boolean)

  return partes.join(" • ")
}

const HistorialNotas = ({ notas }) => {
  if (notas.length === 0) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        No hay notas de salida registradas todavía.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-gray-600">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Variante</th>
            <th className="px-3 py-2">Cantidad</th>
            <th className="px-3 py-2">Motivo</th>
            <th className="px-3 py-2">Documento</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id} className="border-b border-gray-100">
              <td className="px-3 py-2 text-xs font-semibold text-gray-700">
                {formatFecha(nota.createdAt)}
              </td>
              <td className="px-3 py-2">{describirVariante(nota.variante)}</td>
              <td className="px-3 py-2 font-semibold text-blue-600">{nota.cantidad}</td>
              <td className="px-3 py-2">{nota.motivo}</td>
              <td className="px-3 py-2">{nota.documentoRef || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const GestionInventario = () => {
  const { data: productos = [], isLoading, isError, refetch } = useProducto()
  const historialNotas = useHistorialNotasSalida({ limite: 6 })
  const registrarMutation = useRegistrarNotaSalida()
  const [selectedVarianteId, setSelectedVarianteId] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [motivo, setMotivo] = useState("")
  const [documentoRef, setDocumentoRef] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [ultimoMovimiento, setUltimoMovimiento] = useState(null)

  const variantesDisponibles = useMemo(() => {
    return productos.flatMap((producto) => {
      return (producto.variantes || []).map((variante) => ({
        ...variante,
        productoNombre: producto.nombre,
        marca: producto.marca,
        categoria: producto.categoria
      }))
    })
  }, [productos])

  const varianteSeleccionada = variantesDisponibles.find((variante) => variante.id === Number(selectedVarianteId))
  const stockDisponible = ultimoMovimiento?.stockActual ?? varianteSeleccionada?.stockActual ?? 0

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrorMessage("")

    if (!selectedVarianteId) {
      setErrorMessage("Selecciona una variante antes de continuar")
      return
    }

    const cantidadNumero = Number(cantidad)
    if (!cantidad || Number.isNaN(cantidadNumero) || cantidadNumero <= 0) {
      setErrorMessage("Ingresa una cantidad valida mayor a cero")
      return
    }

    if (motivo.trim() === "") {
      setErrorMessage("Describe el motivo de la salida")
      return
    }

    if (varianteSeleccionada && varianteSeleccionada.stockActual < cantidadNumero) {
      setErrorMessage("La cantidad supera el stock disponible")
      return
    }

    registrarMutation.mutate({
      varianteId: Number(selectedVarianteId),
      cantidad: cantidadNumero,
      motivo: motivo.trim(),
      documentoRef: documentoRef.trim() || undefined
    }, {
      onSuccess: (data) => {
        setUltimoMovimiento({
          ...data,
          cantidad: cantidadNumero,
          motivo: motivo.trim()
        })
        setCantidad("")
        setMotivo("")
        setDocumentoRef("")
        historialNotas.refetch()
      },
      onError: (error) => {
        const mensaje = error?.response?.data?.error || "No se pudo registrar la nota de salida"
        setErrorMessage(mensaje)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <SpinnerCargando texto="Cargando inventario..." />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorMessage
        titulo="No se pudo cargar el inventario"
        mensaje="Verifica tu conexion y vuelve a intentarlo."
        onRetry={refetch}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <FormNotaSalida
          variantes={variantesDisponibles}
          selectedVariantId={selectedVarianteId}
          cantidad={cantidad}
          motivo={motivo}
          documentoRef={documentoRef}
          onVariantChange={setSelectedVarianteId}
          onCantidadChange={setCantidad}
          onMotivoChange={setMotivo}
          onDocumentoRefChange={setDocumentoRef}
          onSubmit={handleSubmit}
          isSubmitting={registrarMutation.isLoading}
          errorMessage={errorMessage}
          stockDisponible={stockDisponible}
          motivosRapidos={MOTIVOS_SUGERIDOS}
        />
        <ResumenVariante
          variante={varianteSeleccionada}
          ultimoMovimiento={ultimoMovimiento}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-blue-50 p-6 space-y-4"
      >
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-blue-500">Registro de notas</p>
          <h2 className="text-xl font-bold text-gray-800">Historial de retiros</h2>
          <p className="text-sm text-gray-600">
            Aquí se muestran las últimas notas de salida validadas por el sistema para seguimiento operativo.
          </p>
        </div>

        {historialNotas.isLoading ? (
          <div className="flex justify-center py-6">
            <SpinnerCargando texto="Cargando historial..." />
          </div>
        ) : historialNotas.isError ? (
          <ErrorMessage
            titulo="No se pudo cargar el historial"
            mensaje="Vuelve a intentarlo"
            onRetry={historialNotas.refetch}
          />
        ) : (
          <HistorialNotas notas={historialNotas.data?.notas || []} />
        )}
      </motion.div>
    </motion.div>
  )
}
