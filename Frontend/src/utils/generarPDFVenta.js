import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Función exportada para usar directamente desde otros componentes
export const generarPDFVenta = (venta, opcion = "descargar") => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  if (!venta || !venta.detalles || venta.detalles.length === 0) {
    throw new Error("Datos de venta inválidos")
  }

  // --- ENCABEZADO PRINCIPAL ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("TIENDA CALZADOS AL PAZO", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("FACTURA DE VENTA", 105, 28, { align: "center" })

  // Línea decorativa
  doc.setDrawColor(41, 128, 185)
  doc.setLineWidth(0.5)
  doc.line(10, 33, 200, 33)

  // --- DATOS DE LA VENTA ---
  doc.setFontSize(11)
  doc.setTextColor(50)

  const leftX = 15
  const rightX = 130
  let y = 45

  doc.text(`Número de Factura: ${venta.nroFactura}`, leftX, y)
  doc.text(`Fecha: ${venta.fechaVenta} ${venta.horaVenta}`, rightX, y)
  y += 7
  doc.text(`Cliente: ${venta.cliente}`, leftX, y)
  doc.text(`CI: ${venta.ciCliente}`, rightX, y)
  y += 7
  doc.text(`Estado: ${venta.estado}`, leftX, y)
  doc.text(`Vendedor: ${venta.usuario}`, rightX, y)

  // Línea separadora
  doc.setDrawColor(180)
  doc.line(10, y + 5, 200, y + 5)
  
  // --- Tabla de detalles ---
  const detalles = venta.detalles.map((item, index) => [
    index + 1,
    item.producto || 'N/A',
    item.marca || 'N/A',
    item.codigo || 'N/A',
    item.color || 'N/A',
    item.talla || 'N/A',
    item.cantidad || 0,
    `$${parseFloat(item.precioUnitario || 0).toFixed(2)}`,
    `$${parseFloat(item.subtotal || 0).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    head: [['#', 'Producto', 'Marca', 'Código', 'Color', 'Talla', 'Cantidad', 'Precio Unitario', 'Subtotal']],
    body: detalles,
    startY: 75,
    styles: { fontSize: 9 },
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255, 
      halign: 'center',
      fontSize: 10
    },
    columnStyles: { 
      0: { halign: 'center', cellWidth: 10 }, 
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 15 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'center', cellWidth: 15 },
      7: { halign: 'right', cellWidth: 20 },
      8: { halign: 'right', cellWidth: 20 }
    }
  });
  
  // --- TOTALES ---
  const finalY = doc.lastAutoTable.finalY + 15
  
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  
  // Subtotal
  doc.text("Subtotal:", 130, finalY)
  doc.text(`$${parseFloat(venta.subtotal).toFixed(2)}`, 180, finalY, { align: "right" })
  
  // Descuento (solo si es mayor a 0)
  if (parseFloat(venta.descuento) > 0) {
    doc.text("Descuento:", 130, finalY + 7)
    doc.text(`-$${parseFloat(venta.descuento).toFixed(2)}`, 180, finalY + 7, { align: "right" })
  }
  
  // Total
  doc.setFont("helvetica", "bold")
  doc.text("TOTAL:", 130, finalY + (parseFloat(venta.descuento) > 0 ? 14 : 7))
  doc.text(`$${parseFloat(venta.total).toFixed(2)}`, 180, finalY + (parseFloat(venta.descuento) > 0 ? 14 : 7), { align: "right" })
  
  // Estado de la factura
  doc.setFontSize(10)
  doc.setTextColor(venta.estado === "PAGADA" ? [0, 128, 0] : [255, 0, 0])
  doc.text(`ESTADO: ${venta.estado}`, 15, finalY + 10)

  // --- PIE DE PÁGINA ---
  const pageHeight = doc.internal.pageSize.height
  doc.setTextColor(100)
  doc.setFontSize(8)
  doc.text("¡Gracias por su compra!", 105, pageHeight - 15, { align: "center" })
  doc.text("Tienda Calzados Al Pazo - Tel: 123-456-789", 105, pageHeight - 10, { align: "center" })

  // --- OPCIONES DE SALIDA ---
  if (opcion === "imprimir") {
    // Imprimir
    doc.autoPrint()
    window.open(doc.output('bloburl'))
  } else {
    // Descargar
    doc.save(`Factura_${venta.nroFactura}.pdf`)
  }
}