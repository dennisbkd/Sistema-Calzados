import * as XLSX from "xlsx";

class ExcelGenerator {
  constructor(config = {}) {
    this.config = {
      empresa: {
        nombre: "CALZADOS AL PASO"
      },
      ...config
    };

    this.workbook = XLSX.utils.book_new();
    this.hoja = [];
  }

  inicializar(nombreHoja = "Reporte") {
    this.hojaActualNombre = nombreHoja;
    this._addRow([this.config.empresa.nombre]);
    this._addRow([]);
    return this;
  }

  agregarEncabezado(titulo = "") {
    this._addRow([titulo]);
    this._addRow([]);
    return this;
  }

  agregarMetadata(metadata = {}) {
    this._addRow(["METADATA"]);
    Object.entries(metadata).forEach(([key, value]) => {
      this._addRow([key, value]);
    });
    this._addRow([]);
    return this;
  }

  agregarSeccion(configSeccion) {
    const {
        titulo,
        tipo = "tabla",
        datos = [],
        columnas = [],
        contenidoTexto = "",
        datosResumen = {}
    } = configSeccion;

    this._addRow([titulo.toUpperCase()]);
    this._addRow([]);

    switch (tipo) {
        case "tabla":
        this._agregarTabla(columnas, datos);
        break;

        case "texto":
        this._agregarTexto(contenidoTexto);
        break;

        case "resumen": {
        // Acepta ambas formas: datos o datosResumen
        const resumen = configSeccion.datos || datosResumen || {};
        this._agregarResumen(resumen);
        break;
        }
    }

    this._addRow([]);
    return this;
    }



  /** -------------------------
   *   TABLA (CON MAPEO AUTOMÁTICO)
   *  ------------------------- */
  _agregarTabla(columnas, datos) {
    if (datos.length === 0) {
      this._addRow(["No hay datos"]);
      return;
    }

    // Encabezados exactos como vienen del PDF
    this._addRow(columnas);

    datos.forEach(item => {
      const fila = columnas.map(col => this._obtenerValorMapeado(item, col));
      this._addRow(fila);
    });
  }

  _obtenerValorMapeado(item, columna) {
    const clave = columna.toLowerCase();

    const posiblesClaves = [
      clave,
      this._camelCase(clave),
      this._snakeCase(clave),
      this._quitarAcentos(clave),
      ...Object.keys(item).filter(key =>
        key.toLowerCase().includes(clave) || clave.includes(key.toLowerCase())
      )
    ];

    let valor = "-";

    for (const k of posiblesClaves) {
      if (item[k] !== undefined && item[k] !== null) {
        valor = item[k];
        break;
      }
    }

    return this._formatear(columna, valor);
  }

  _formatear(nombreColumna, valor) {
    const col = nombreColumna.toLowerCase();

    // precios / montos
    if (col.includes("precio") || col.includes("total") || col.includes("monto")) {
      const n = parseFloat(valor) || 0;
      return `Bs. ${n.toFixed(2)}`;
    }

    // fechas
    if (col.includes("fecha")) {
      if (typeof valor === "string" && valor.match(/\d{4}-\d{2}-\d{2}/)) {
        return new Date(valor).toLocaleDateString("es-ES");
      }
    }

    // booleanos
    if (col.includes("estado") && typeof valor === "boolean") {
      return valor ? "Activo" : "Inactivo";
    }

    return valor ?? "-";
  }

  /** helpers del PDF **/
  _camelCase(texto) {
    return texto.replace(/([-_][a-z])/g, g => g.toUpperCase().replace("-", "").replace("_", ""));
  }

  _snakeCase(texto) {
    return texto.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  _quitarAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /** ---------------------- */

  _agregarTexto(texto) {
    this._addRow([texto]);
  }

  _agregarResumen(datos) {
    Object.entries(datos).forEach(([key, value]) => {
      this._addRow([key, value]);
    });
  }

  _addRow(fila) {
    this.hoja.push(fila);
  }

  generar(nombreArchivo = "reporte.xlsx") {
    const hojaExcel = XLSX.utils.aoa_to_sheet(this.hoja);

    hojaExcel["!cols"] = [
      { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 12 },
      { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(this.workbook, hojaExcel, this.hojaActualNombre);
    XLSX.writeFile(this.workbook, nombreArchivo);
  }
}

export default ExcelGenerator;
