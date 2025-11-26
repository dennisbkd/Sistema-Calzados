import PDFGenerator from './generarPDF.js'
export const generarPDF = (config) => {
  const {
    // Configuración básica
    titulo = "REPORTE",
    
    // Metadata (filtros, fechas, etc.)
    metadata = {},
    
    // Secciones dinámicas (pueden ser 1 o varias)
    secciones = [],
    
    // Configuración de salida
    nombreArchivo = "reporte.pdf",
    opcion = "descargar"
    
  } = config

  const generator = new PDFGenerator()
  
  generator
    .inicializar()
    .agregarEncabezado(titulo)
    .agregarMetadata(metadata)

  // Procesar todas las secciones dinámicamente
  secciones.forEach(seccion => {
    generator.agregarSeccion(seccion)
  })

  return generator.generar(nombreArchivo, opcion)
}