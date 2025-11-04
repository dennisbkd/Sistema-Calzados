import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generarPDFReporte = (
  reporte, 
  compras = [], 
  ventas = [], 
  periodo, 
  opcion = "descargar", //completo solo es ingresos y egresos
  tipoReporte = "completo" // "completo" | "ventas" | "compras" | "inventario"
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Validación básica
  if (!reporte && tipoReporte !== "inventario") {
    throw new Error("Datos del reporte inválidos")
  }

  // --- ENCABEZADO PRINCIPAL ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("CALZADOS AL PASO", 105, 20, { align: "center" })

  // Título según tipo de reporte
  let tituloReporte = ""
  switch(tipoReporte) {
    case "ventas":
      tituloReporte = "REPORTE DE VENTAS"
      break
    case "compras":
      tituloReporte = "REPORTE DE COMPRAS"
      break
    case "inventario":
      tituloReporte = "REPORTE DE INVENTARIO"
      break
    default:
      tituloReporte = "REPORTE DE INGRESOS Y EGRESOS"
  }

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text(tituloReporte, 105, 28, { align: "center" })

  // Línea decorativa
  doc.setDrawColor(41, 128, 185)
  doc.setLineWidth(0.5)
  doc.line(10, 33, 200, 33)

  // --- PERIODO DEL REPORTE ---
  doc.setFontSize(11)
  doc.setTextColor(50)
  doc.text(`Periodo: ${periodo.fechaInicio} a ${periodo.fechaFin}`, 15, 45)
  doc.text(`Generado: ${new Date().toLocaleDateString()}`, 15, 52)

  let y = 65 // Posición Y inicial después del período

  // --- RESUMEN FINANCIERO (solo para reporte completo) ---
  if (tipoReporte === "completo" && reporte) {
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("RESUMEN FINANCIERO", 15, y)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    
    const resumen = reporte.resumen
    y += 10
    
    doc.text(`Total Ingresos: Bs. ${resumen.totalIngresos.toFixed(2)}`, 20, y)
    y += 7
    doc.text(`Total Egresos: Bs. ${resumen.totalEgresos.toFixed(2)}`, 20, y)
    y += 7
    doc.text(`Balance Neto: Bs. ${resumen.balance.toFixed(2)}`, 20, y)
    y += 7
    doc.text(`Margen: ${resumen.margen}%`, 20, y)
    y += 7
    doc.text(`Ventas realizadas: ${resumen.cantidadVentas}`, 20, y)
    y += 7
    doc.text(`Compras realizadas: ${resumen.cantidadCompras}`, 20, y)

    // Línea separadora
    doc.setDrawColor(180)
    doc.line(10, y + 5, 200, y + 5)
    y += 15
  }

  // --- REPORTE DE INVENTARIO (placeholder) ---
  if (tipoReporte === "inventario") {
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("REPORTE DE INVENTARIO", 15, y)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y += 15
    doc.text("Funcionalidad de inventario en desarrollo...", 20, y)
    y += 20
    
    // Línea separadora
    doc.setDrawColor(180)
    doc.line(10, y + 5, 200, y + 5)
    y += 15
  }

  // --- TABLA RESUMEN DE COMPRAS ---
  if ((tipoReporte === "completo" || tipoReporte === "compras") && compras.length > 0) {
    const comprasResumen = compras.map(compra => [
      compra.nroFactura,
      compra.proveedor,
      compra.fechaCompra,
      `Bs. ${parseFloat(compra.total).toFixed(2)}`,
      compra.estado
    ])

    // Título de la tabla
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("COMPRAS DEL PERIODO", 15, y - 5)

    autoTable(doc, {
      head: [['FACTURA', 'PROVEEDOR', 'FECHA', 'TOTAL', 'ESTADO']],
      body: comprasResumen,
      startY: y + 5,
      styles: { fontSize: 9 },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255, 
        halign: 'center',
        fontSize: 10 
      },
      columnStyles: { 
        0: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'center' }
      },
      margin: { top: 10 }
    })

    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : y + 15
  }

  // --- TABLA RESUMEN DE VENTAS ---
  if ((tipoReporte === "completo" || tipoReporte === "ventas") && ventas.length > 0) {
    const ventasResumen = ventas.map(venta => [
      venta.nroFactura,
      venta.cliente,
      venta.fechaVenta,
      `Bs. ${parseFloat(venta.total).toFixed(2)}`,
      venta.estado
    ])

    // Título de la tabla
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("VENTAS DEL PERIODO", 15, y - 5)

    autoTable(doc, {
      head: [['FACTURA', 'CLIENTE', 'FECHA', 'TOTAL', 'ESTADO']],
      body: ventasResumen,
      startY: y + 5,
      styles: { fontSize: 9 },
      headStyles: { 
        fillColor: [34, 153, 84], 
        textColor: 255, 
        halign: 'center',
        fontSize: 10 
      },
      columnStyles: { 
        0: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'center' }
      },
      margin: { top: 10 }
    })
  }

  // --- PIE DE PÁGINA ---
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleString()}`,
      105,
      290,
      { align: "center" }
    )
  }

  // --- OPCIONES DE SALIDA ---
  let nombreArchivo = ""
  switch(tipoReporte) {
    case "ventas":
      nombreArchivo = `Reporte_Ventas_${periodo.fechaInicio}_a_${periodo.fechaFin}.pdf`
      break
    case "compras":
      nombreArchivo = `Reporte_Compras_${periodo.fechaInicio}_a_${periodo.fechaFin}.pdf`
      break
    case "inventario":
      nombreArchivo = `Reporte_Inventario_${periodo.fechaInicio}_a_${periodo.fechaFin}.pdf`
      break
    default:
      nombreArchivo = `Reporte_Ingresos_Egresos_${periodo.fechaInicio}_a_${periodo.fechaFin}.pdf`
  }

  if (opcion === "imprimir") {
    doc.autoPrint()
    window.open(doc.output('bloburl'))
  } else {
    doc.save(nombreArchivo)
  }
}