// utils/generarPDFVenta.js - VERSIÓN CORREGIDA
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generarPDFVenta = (venta, opcion = "descargar") => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  if (!venta || !venta.detalles || venta.detalles.length === 0) {
    throw new Error("Datos de venta inválidos")
  }

  // --- ENCABEZADO CON COLOR ---
  doc.setFillColor(41, 128, 185)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text("TIENDA CALZADOS AL PAZO", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("FACTURA DE VENTA", 105, 30, { align: "center" })

  // --- INFORMACIÓN DE LA VENTA ---
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  
  const infoVenta = [
    [`Número de Factura: ${venta.nroFactura}`, `Fecha: ${new Date(venta.createdAt).toLocaleDateString('es-BO')}`],
    [`Cliente: ${venta.cliente?.nombre || 'No especificado'}`, `Vendedor: ${venta.usuario?.nombre || 'No especificado'}`],
    [`Email: ${venta.cliente?.contacto || 'No especificado'}`, `Estado: ${venta.estado}`],
    [`CI: ${venta.cliente?.ci || 'No especificado'}`, `Total: Bs ${parseFloat(venta.total || 0).toFixed(2)}`]
  ]

  autoTable(doc, {
    body: infoVenta,
    startY: 50,
    styles: { fontSize: 10, cellPadding: 3 },
    theme: 'grid',
    tableWidth: 'wrap',
    margin: { left: 15, right: 15 }
  })

  // --- DETALLES DE PRODUCTOS ---
  const detalles = venta.detalles.map((item, index) => [
    index + 1,
    item.variante?.producto?.nombre || 'N/A',
    `${item.variante?.color || 'N/A'} - ${item.variante?.talla || 'N/A'}`,
    item.variante?.codigo || 'N/A',
    item.cantidad || 0,
    `Bs ${parseFloat(item.precioUnitario || 0).toFixed(2)}`,
    `Bs ${parseFloat(item.subtotal || 0).toFixed(2)}`
  ])

  autoTable(doc, {
    head: [['#', 'Producto', 'Color/Talla', 'Código', 'Cant.', 'P. Unitario', 'Subtotal']],
    body: detalles,
    startY: doc.lastAutoTable.finalY + 10,
    styles: { fontSize: 9 },
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 9
    },
    columnStyles: { 
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'right', cellWidth: 25 },
      6: { halign: 'right', cellWidth: 25 }
    },
    margin: { left: 15, right: 15 }
  })

  // --- RESUMEN FINAL ---
  const resumenY = doc.lastAutoTable.finalY + 15
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("RESUMEN DE VENTA", 15, resumenY)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  
  let summaryY = resumenY + 8
  doc.text(`Subtotal: Bs ${parseFloat(venta.subtotal || 0).toFixed(2)}`, 150, summaryY, { align: "right" })
  summaryY += 5
  doc.text(`Descuento: -Bs ${parseFloat(venta.descuento || 0).toFixed(2)}`, 150, summaryY, { align: "right" })
  summaryY += 5
  doc.setFont("helvetica", "bold")
  doc.text(`TOTAL: Bs ${parseFloat(venta.total || 0).toFixed(2)}`, 150, summaryY, { align: "right" })

  // --- PIE DE PÁGINA ---
  const pageHeight = doc.internal.pageSize.height
  doc.setFont("helvetica", "italic")
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text("¡Gracias por su compra! - Documento válido como factura", 105, pageHeight - 15, { align: "center" })
  doc.text(`Generado el ${new Date().toLocaleDateString('es-BO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 105, pageHeight - 10, { align: "center" })

  // --- EJECUTAR ACCIÓN SIN WARNINGS ---
  if (opcion === "imprimir") {
    // Abrir en nueva pestaña para imprimir manualmente
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, '_blank')
  } else {
    // Descargar
    doc.save(`Factura_Venta_${venta.nroFactura}.pdf`)
  }
}