import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

 class PDFGenerator {
  constructor(config = {}) {
    this.config = {
      empresa: {
        nombre: "CALZADOS AL PASO",
        colorPrimario: [41, 128, 185]
      },
      ...config
    }
    this.doc = null
    this.yPos = 0
  }

  inicializar(orientacion = "portrait", formato = "a4") {
    this.doc = new jsPDF({
      orientation: orientacion,
      unit: "mm",
      format: formato,
    })
    this.yPos = 20
    return this
  }

  agregarEncabezado( subtitulo = "") {
    // Encabezado fijo de la empresa
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(18)
    this.doc.text(this.config.empresa.nombre, 105, this.yPos, { align: "center" })
    this.yPos += 10

    // Subtítulo dinámico
    if (subtitulo) {
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(14)
      this.doc.text(subtitulo, 105, this.yPos, { align: "center" })
      this.yPos += 8
    }

    // Línea decorativa
    this.doc.setDrawColor(...this.config.empresa.colorPrimario)
    this.doc.setLineWidth(0.5)
    this.doc.line(10, this.yPos, 200, this.yPos)
    this.yPos += 15

    return this
  }

  agregarMetadata(metadata = {}) {
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "normal")
    this.doc.setTextColor(80)

    Object.entries(metadata).forEach(([key, value], index) => {
      this.doc.text(`${key}: ${value}`, 15, this.yPos + (index * 6))
    })

    this.yPos += (Object.keys(metadata).length * 6) + 10
    return this
  }

  agregarSeccion(configSeccion) {
    const {
      titulo,
      tipo = "tabla", // "tabla", "texto", "resumen", "custom"
      datos = [],
      columnas = [],
      mapearDatos = null,
      color = this.config.empresa.colorPrimario,
      contenidoTexto = "",
      contenidoCustom = null,
      opcionesTabla = {}
    } = configSeccion

    // Título de sección
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(titulo.toUpperCase(), 15, this.yPos)
    this.yPos += 8

    // Contenido según tipo
    switch(tipo) {
      case "tabla":
        this._agregarTabla(columnas, datos, mapearDatos, color, opcionesTabla)
        break
      case "texto":
        this._agregarTexto(contenidoTexto)
        break
      case "resumen":
        this._agregarResumen(datos)
        break
      case "custom":
        if (contenidoCustom) contenidoCustom(this.doc, this)
        break
    }

    this.yPos += 10
    return this
  }

  _agregarTabla(columnas, datos, mapearDatos, color, opciones) {
    if (!datos || datos.length === 0) {
      this._agregarTexto("No hay datos disponibles")
      return
    }

    const datosProcesados = mapearDatos 
      ? datos.map(mapearDatos)
      : this._mapearDatosAutomatico(datos, columnas)

    autoTable(this.doc, {
      head: [columnas],
      body: datosProcesados,
      startY: this.yPos,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { 
        fillColor: color,
        textColor: 255,
        halign: 'center',
        fontSize: 9
      },
      columnStyles: this._generarEstilosColumnas(columnas, datosProcesados),
      ...opciones
    })

    this.yPos = this.doc.lastAutoTable.finalY + 10
  }

  // En tu PDFGenerator class, modifica el mapeo automático:
  _mapearDatosAutomatico(datos, columnas) {
    return datos.map(item => {
      return columnas.map(columna => {
        // Convierte la columna a diferentes formatos para buscar
        const clave = columna.toLowerCase()
        const posiblesClaves = [
          clave,
          this._camelCase(clave),
          this._snakeCase(clave),
          this._quitarAcentos(clave),
          // Busca coincidencias parciales
          ...Object.keys(item).filter(key => 
            key.toLowerCase().includes(clave) || 
            clave.includes(key.toLowerCase())
          )
        ]
        
        // Encuentra el valor
        let valor = '-'
        for (const posibleClave of posiblesClaves) {
          if (item[posibleClave] !== undefined && item[posibleClave] !== null) {
            valor = item[posibleClave]
            break
          }
        }

        // Formateo inteligente basado en el nombre de la columna
        return this._formatearValor(columna, valor)
      })
    })
  }

  // Agrega estos métodos helper a tu clase:
  _camelCase(texto) {
    return texto.replace(/([-_][a-z])/g, group =>
      group.toUpperCase().replace('-', '').replace('_', '')
    )
  }

  _snakeCase(texto) {
    return texto.replace(/([A-Z])/g, '_$1').toLowerCase()
  }

  _quitarAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  _formatearValor(nombreColumna, valor) {
    const columna = nombreColumna.toLowerCase()
    
    // Formateo para montos monetarios
    if (columna.includes('total') || columna.includes('precio') || 
        columna.includes('monto') || columna.includes('subtotal') || 
        columna.includes('descuento') || columna.includes('importe')) {
      const numero = parseFloat(valor) || 0
      return `Bs. ${numero.toFixed(2)}`
    }
    
    // Formateo para fechas
    if ((columna.includes('fecha') || columna.includes('date')) && valor) {
      try {
        if (typeof valor === 'string' && valor.match(/\d{4}-\d{2}-\d{2}/)) {
          return new Date(valor).toLocaleDateString('es-ES')
        }
      } catch (e) {
        console.error(e)
        return valor
      }
    }
    
    // Formateo para horas
    if (columna.includes('hora') || columna.includes('time')) {
      return valor || '-'
    }
    
    // Formateo para estados booleanos
    if (columna.includes('estado') && typeof valor === 'boolean') {
      return valor ? '✅ Activo' : '❌ Inactivo'
    }
    
    // Valor por defecto
    return valor || '-'
  }

  _obtenerValorAnidado(objeto, path) {
    return path.split('.').reduce((obj, key) => obj?.[key], objeto)
  }

  _generarEstilosColumnas(columnas) {
    const estilos = {}
    
    columnas.forEach((columna, index) => {
      if (columna.includes('TOTAL') || columna.includes('PRECIO') || columna.includes('MONTO')) {
        estilos[index] = { halign: 'right', fontStyle: 'bold' }
      } else if (columna.includes('FECHA')) {
        estilos[index] = { halign: 'center' }
      } else if (columna.includes('ESTADO') || columna.includes('CANTIDAD') || columna.includes('STOCK')) {
        estilos[index] = { halign: 'center' }
      } else {
        estilos[index] = { halign: 'left' }
      }
    })
    
    return estilos
  }

  _agregarTexto(texto) {
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "normal")
    this.doc.setTextColor(80)
    
    const lineas = this.doc.splitTextToSize(texto, 180)
    lineas.forEach(linea => {
      this.doc.text(linea, 20, this.yPos)
      this.yPos += 5
    })
  }

  _agregarResumen(items) {
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "normal")
    
    Object.entries(items).forEach(([label, value], index) => {
      this.doc.setTextColor(60)
      this.doc.text(`${label}:`, 20, this.yPos + (index * 6))
      this.doc.setTextColor(30)
      this.doc.text(String(value), 80, this.yPos + (index * 6))
    })

    this.yPos += (Object.keys(items).length * 6) + 5
  }

  agregarPiePagina() {
    const pageCount = this.doc.internal.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setTextColor(150)
      this.doc.text(
        `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleString()}`,
        105,
        290,
        { align: "center" }
      )
    }
    
    return this
  }

  generar(nombreArchivo = "reporte.pdf", opcion = "descargar") {
    this.agregarPiePagina()
    
    if (opcion === "imprimir") {
      this.doc.autoPrint()
      window.open(this.doc.output('bloburl'))
    } else {
      this.doc.save(nombreArchivo)
    }

    return this.doc
  }
}

export default PDFGenerator