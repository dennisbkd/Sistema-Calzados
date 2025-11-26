import ExcelGenerator from './generarExcel.js'

export const generarExcel = (config) => {
  const {
    titulo = "REPORTE",
    metadata = {},
    secciones = [],
    nombreArchivo = "reporte.xlsx",
    opcion = "descargar"
  } = config;

  const generator = new ExcelGenerator();

  generator
    .inicializar()
    .agregarEncabezado(titulo)
    .agregarMetadata(metadata);

  secciones.forEach((seccion) => {
    generator.agregarSeccion(seccion);
  });

  return generator.generar(nombreArchivo, opcion);
};
