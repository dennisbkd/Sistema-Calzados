import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { useControlCaja } from "../hooks/useControlCaja"
import { SpinnerCargando } from "../../../global/components/SpinnerCargando"
import { ErrorMessage } from "../../../global/components/ErrorMessage"
import { CardCaja } from "../components/CardCaja"
import dayjs from "dayjs"

const formatoFecha = (fecha) => {
  if (!fecha) return "-"
  return dayjs(fecha).format("DD MMM YYYY")
}

const EstadoCaja = ({ data }) => {
  if (!data) return null
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <CardCaja label="Total ingresos" value={data.totalIngresos} accent="success" />
      <CardCaja label="Total egresos" value={data.totalEgresos} accent="danger" />
      <CardCaja label="Saldo" value={data.saldo} accent={data.saldo >= 0 ? "success" : "danger"} />
    </div>
  )
}

const MensajeResumen = ({ data, fechaSeleccionada }) => {
  if (!data) return null
  if (data.sinMovimientos) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-4 text-sm shadow-sm">
        No existen transacciones para la fecha indicada ({formatoFecha(fechaSeleccionada)}).
      </div>
    )
  }

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 text-sm text-gray-600">
      <p className="font-semibold text-gray-800">Resumen del día {formatoFecha(fechaSeleccionada)}</p>
      <p>El saldo representa la diferencia entre ingresos y egresos registrados en el sistema.</p>
    </div>
  )
}

const descargaCsv = ({ resumen, fecha }) => {
  const rows = [
    ["Fecha", "Total ingresos", "Total egresos", "Saldo"],
    [dayjs(fecha).format("DD/MM/YYYY"), resumen.totalIngresos, resumen.totalEgresos, resumen.saldo],
    [],
    ["Detalle ingresos (ventas)"],
    ["Referencia", "Monto", "Estado", "Detalle"],
    ...((resumen.ventas || []).map(v => [v.nroFactura || v.id, v.total, v.estado, v.detalle || "-"])),
    [],
    ["Detalle egresos (compras)"],
    ["Referencia", "Monto", "Estado", "Detalle"],
    ...((resumen.compras || []).map(c => [c.nroFactura || c.id, c.total, c.estado, c.detalle || "-"]))
  ]
  const contenido = rows.map((row) => row.join(",")).join("\n")
  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = `control-caja-${fecha}.csv`
  enlace.click()
  URL.revokeObjectURL(url)
}

const TablaBalance = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="px-6 py-4 bg-blue-50 text-xs uppercase tracking-wide text-blue-600 font-semibold">
        Estado del día
      </div>
      <table className="min-w-full text-left text-sm text-gray-600">
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="px-6 py-3 font-semibold text-gray-800">Ingresos registrados</td>
            <td className="px-6 py-3">Bs {Number(data.totalIngresos || 0).toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-6 py-3 font-semibold text-gray-800">Egresos registrados</td>
            <td className="px-6 py-3">Bs {Number(data.totalEgresos || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 font-semibold text-gray-800">Resultado del día</td>
            <td className="px-6 py-3">Bs {Number(data.saldo || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const TablaDetalle = ({ titulo, registros }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="px-6 py-4 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 font-semibold">
      {titulo}
    </div>
    <table className="min-w-full text-left text-sm text-gray-600">
      <thead>
        <tr className="text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
          <th className="px-4 py-2">Referencia</th>
          <th className="px-4 py-2">Monto</th>
          <th className="px-4 py-2">Estado</th>
          <th className="px-4 py-2">Detalle</th>
        </tr>
      </thead>
      <tbody>
        {registros.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-4 py-3 text-xs text-gray-500">
              Sin movimientos registrados
            </td>
          </tr>
        ) : registros.map((item) => (
          <tr key={`${titulo}-${item.id}`} className="border-b border-gray-100">
            <td className="px-4 py-2">{item.nroFactura || item.id}</td>
            <td className="px-4 py-2">Bs {Number(item.total).toFixed(2)}</td>
            <td className="px-4 py-2">{item.estado}</td>
            <td className="px-4 py-2">{item.detalle || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const construirReporteHtml = ({ resumen, fecha }) => {
  const encabezado = `
    <div style="font-family:Arial,sans-serif;padding:24px;width:100%;box-sizing:border-box;">
      <h1 style="margin:0;font-size:22px;color:#0f172a;">Control de caja diaria</h1>
      <p style="margin:4px 0 16px;color:#475569;">Balance del ${formatoFecha(fecha)}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <th style="text-align:left;padding:8px;border:1px solid #cbd5f5;background:#f8fafc;">Total ingresos</th>
          <th style="text-align:left;padding:8px;border:1px solid #cbd5f5;background:#f8fafc;">Total egresos</th>
          <th style="text-align:left;padding:8px;border:1px solid #cbd5f5;background:#f8fafc;">Saldo</th>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #cbd5f5;">Bs ${Number(resumen.totalIngresos || 0).toFixed(2)}</td>
          <td style="padding:8px;border:1px solid #cbd5f5;">Bs ${Number(resumen.totalEgresos || 0).toFixed(2)}</td>
          <td style="padding:8px;border:1px solid #cbd5f5;">Bs ${Number(resumen.saldo || 0).toFixed(2)}</td>
        </tr>
      </table>
  `

  const tablaDetalle = (titulo, registros) => `
    <h3 style="margin:16px 0 8px;color:#0f172a;font-size:16px;">${titulo}</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:6px;border:1px solid #cbd5f5;background:#e2e8f0;">Referencia</th>
          <th style="text-align:left;padding:6px;border:1px solid #cbd5f5;background:#e2e8f0;">Monto</th>
          <th style="text-align:left;padding:6px;border:1px solid #cbd5f5;background:#e2e8f0;">Estado</th>
          <th style="text-align:left;padding:6px;border:1px solid #cbd5f5;background:#e2e8f0;">Detalle</th>
        </tr>
      </thead>
      <tbody>
        ${
          registros.length === 0
            ? '<tr><td colspan="4" style="padding:6px;border:1px solid #cbd5f5;font-size:12px;color:#64748b;">Sin movimientos</td></tr>'
            : registros.map(item => `
              <tr>
                <td style="padding:6px;border:1px solid #cbd5f5;">${item.nroFactura || item.id}</td>
                <td style="padding:6px;border:1px solid #cbd5f5;">Bs ${Number(item.total).toFixed(2)}</td>
                <td style="padding:6px;border:1px solid #cbd5f5;">${item.estado}</td>
                <td style="padding:6px;border:1px solid #cbd5f5;">${item.detalle || '-'}</td>
              </tr>
            `).join('')
        }
      </tbody>
    </table>
  `

  const contenido = `
    ${encabezado}
    ${tablaDetalle('Detalle de ingresos (ventas)', resumen.ventas || [])}
    ${tablaDetalle('Detalle de egresos (compras)', resumen.compras || [])}
    </div>
  `

  return `
  <html>
    <head>
      <title>Reporte control caja</title>
      <meta charset="utf-8" />
    </head>
    <body style="margin:0;background:#f8fafc;">
      ${contenido}
    </body>
  </html>`
}

export const ControlCaja = () => {
  const [fechaFiltrada, setFechaFiltrada] = useState(dayjs().format("YYYY-MM-DD"))
  const { data, isLoading, isError, refetch } = useControlCaja({ fecha: fechaFiltrada })
  const resumen = useMemo(() => data || {
    totalIngresos: 0,
    totalEgresos: 0,
    saldo: 0,
    sinMovimientos: true,
    ventas: [],
    compras: []
  }, [data])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <SpinnerCargando texto="Calculando control de caja..." />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorMessage
        titulo="No se pudo obtener el control de caja"
        mensaje="Verifica tu conexión y vuelve a intentarlo."
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
      <div className="bg-white rounded-2xl shadow-xl border border-blue-50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Control de caja diaria</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">Balance financiero del día</h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Fecha</label>
            <input
              type="date"
              value={fechaFiltrada}
              max={dayjs().format("YYYY-MM-DD")}
              onChange={(event) => setFechaFiltrada(event.target.value)}
              className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Compara los ingresos (ventas) frente a los egresos (compras) y obtén el saldo que debes verificar en el arqueo.
        </p>
        <div className="mt-6 space-y-4">
          <EstadoCaja data={resumen} />
          <MensajeResumen data={resumen} fechaSeleccionada={fechaFiltrada} />
        </div>
        <TablaBalance data={resumen} />
        <div className="space-y-4">
          <TablaDetalle titulo="Detalle de ingresos (ventas)" registros={resumen.ventas || []} />
          <TablaDetalle titulo="Detalle de egresos (compras)" registros={resumen.compras || []} />
        </div>
        <div className="flex flex-wrap gap-3 justify-end mt-4">
          <button
            onClick={() => descargaCsv({ resumen, fecha: fechaFiltrada })}
            className="text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100"
          >
            Exportar Excel
          </button>
          <button
            onClick={() => {
              const html = construirReporteHtml({ resumen, fecha: fechaFiltrada })
              const ventana = window.open('', '_blank')
              ventana.document.write(html)
              ventana.document.close()
              ventana.focus()
              ventana.print()
            }}
            className="text-white bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Imprimir reporte
          </button>
        </div>
      </div>
    </motion.div>
  )
}
