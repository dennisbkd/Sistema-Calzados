import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generarPDFReporte = (reporte, compras = [], ventas = [], periodo, opcion = "descargar") => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Validación básica
  if (!reporte) {
    throw new Error("Datos del reporte inválidos")
  }

  // --- ENCABEZADO PRINCIPAL ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("CALZADOS AL PASO", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("REPORTE DE INGRESOS Y EGRESOS", 105, 28, { align: "center" })

  // Línea decorativa
  doc.setDrawColor(41, 128, 185)
  doc.setLineWidth(0.5)
  doc.line(10, 33, 200, 33)

  // --- PERIODO DEL REPORTE ---
  doc.setFontSize(11)
  doc.setTextColor(50)
  doc.text(`Periodo: ${periodo.fechaInicio} a ${periodo.fechaFin}`, 15, 45)
  doc.text(`Generado: ${new Date().toLocaleDateString()}`, 15, 52)

  // --- RESUMEN FINANCIERO ---
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("RESUMEN FINANCIERO", 15, 65)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  
  const resumen = reporte.resumen
  let y = 75
  
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

  // --- TABLA RESUMEN DE COMPRAS ---
  if (compras.length > 0) {
    const comprasResumen = compras.map(compra => [
      compra.nroFactura,
      compra.proveedor,
      compra.fechaCompra,
      `Bs. ${parseFloat(compra.total).toFixed(2)}`,
      compra.estado
    ])

    autoTable(doc, {
      head: [['FACTURA', 'PROVEEDOR', 'FECHA', 'TOTAL', 'ESTADO']],
      body: comprasResumen,
      startY: y + 15,
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
  }

  // --- TABLA RESUMEN DE VENTAS ---
  if (ventas.length > 0) {
    const ventasResumen = ventas.map(venta => [
      venta.nroFactura,
      venta.cliente,
      venta.fechaVenta,
      `Bs. ${parseFloat(venta.total).toFixed(2)}`,
      venta.estado
    ])

    autoTable(doc, {
      head: [['FACTURA', 'CLIENTE', 'FECHA', 'TOTAL', 'ESTADO']],
      body: ventasResumen,
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : y + 15,
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
  if (opcion === "imprimir") {
    doc.autoPrint()
    window.open(doc.output('bloburl'))
  } else {
    const nombreArchivo = `Reporte_Ingresos_Egresos_${periodo.fechaInicio}_a_${periodo.fechaFin}.pdf`
    doc.save(nombreArchivo)
  }
}