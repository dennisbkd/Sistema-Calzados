import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


// Función exportada para usar directamente desde otros componentes
 export const generarPDFCompra = (compra, opcion = "descargar") => {
    const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // const logo = "/LogoTienda.jpg"

  // Validación básica
  if (!compra || !compra.detalles || compra.detalles.length === 0) {
    throw new Error("Datos de compra inválidos")
  }

  // --- LOGO ---
  // doc.addImage(logo, "JPG", 15, 10, 30, 30)

  // --- ENCABEZADO PRINCIPAL ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("TIENDA CALZADOS AL PAZO", 105, 20, { align: "center" })

  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("FACTURA DE COMPRA", 105, 28, { align: "center" })

  // Línea decorativa
  doc.setDrawColor(41, 128, 185)
  doc.setLineWidth(0.5)
  doc.line(10, 33, 200, 33)

  // --- DATOS DE LA COMPRA ---
  doc.setFontSize(11)
  doc.setTextColor(50)

  const leftX = 15
  const rightX = 130
  let y = 45

  doc.text(`Número de Factura: ${compra.nroFactura}`, leftX, y)
  doc.text(`Fecha: ${compra.fecha} ${compra.hora}`, rightX, y)
  y += 7
  doc.text(`Proveedor: ${compra.proveedor}`, leftX, y)
  doc.text(`Usuario: ${compra.usuario}`, rightX, y)

  // Línea separadora
  doc.setDrawColor(180)
  doc.line(10, y + 5, 200, y + 5)
  
  // --- Tabla de detalles ---
  const detalles = compra.detalles.map((item, index) => [
    index + 1,
    item.descripcion || 'N/A',
    item.marca || 'N/A',
    item.codigo || 'N/A',
    item.color || 'N/A',
    item.talla || 'N/A',
    item.cantidad || 0,
    parseFloat(item.precioUnitario || 0).toFixed(2),
    parseFloat(item.subtotal || 0).toFixed(2)
  ]);
  
  autoTable(doc, {
    head: [['#', 'Descripción', 'Marca', 'Código', 'Color', 'Talla', 'Cantidad', 'Precio Unitario', 'Subtotal']],
    body: detalles,
    startY: 100,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
    columnStyles: { 
      0: { halign: 'center' }, 
      6: { halign: 'center' }, 
      7: { halign: 'right' }, 
      8: { halign: 'right' } 
    }
  });
  
  // --- Total ---
  const totalY = doc.lastAutoTable.finalY + 10
  doc.setFontSize(12)
  doc.text(`Total: ${parseFloat(compra.total).toFixed(2)}`, 150, totalY);
  
  if (opcion === "imprimir") {
    // Imprimir
    doc.autoPrint()
    window.open(doc.output('bloburl'))
  } else {
    // Descargar
    doc.save(`Factura_${compra.nroFactura}.pdf`)
  }
}
