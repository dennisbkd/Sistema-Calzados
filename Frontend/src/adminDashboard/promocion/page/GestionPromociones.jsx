import React, { useMemo, useState, useEffect } from 'react';
import { Plus, Tag } from 'lucide-react';
import { TablaPromociones } from '../components/TablaPromociones';
import { usePromocionManager } from '../hooks/usePromocionManager';
import { BotonAccion } from '../../../global/components/Boton/BotonAccion';
import { PageCabecera } from '../../../global/components/cabecera/PageCabecera';
import { BuscarInput } from '../../../global/components/filtros/BuscarInput';
import { FiltrarFIlas } from '../../../global/components/filtros/FiltrarFIlas';
import { SeleccionarFiltros } from '../../../global/components/filtros/SeleccionarFiltros';
import { useFiltros } from '../../../global/hooks/useFiltros';
import { FormModal } from '../../../global/components/formulario/FormModal';
import { FormInput } from '../../../global/components/formulario/FormInput';
import toast from 'react-hot-toast';
import { listar as listarCategorias } from '../../../api/categoria/categoriaApi';
import { ObtenerProductos } from '../../../api/producto/productoApi';

export const GestionPromociones = () => {
  const { promociones = [], crearPromocion, editarPromocion, eliminarPromocion } = usePromocionManager();
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [promocionActual, setPromocionActual] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const { filtros, menuFiltrosAbierto, actualizarFiltro, toggleMenuFiltros } = useFiltros({
    filtroTipo: 'todos',
    filtroAlcance: 'todos'
  });

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [alcanceSeleccionado, setAlcanceSeleccionado] = useState('GENERAL');

  React.useEffect(() => {
    // Cargar listas cuando se abre el modal o cuando se selecciona alcance
    const cargarCatalogos = async () => {
      try {
        const [cats, prods] = await Promise.all([listarCategorias(), ObtenerProductos()]);
        setCategorias(cats || []);
        setProductos(prods || []);
      } catch (e) {
        // Silenciar si falla, no bloquea la vista
      }
    };
    cargarCatalogos();
  }, []);

  useEffect(() => {
    setAlcanceSeleccionado(promocionActual?.alcance || 'GENERAL');
  }, [promocionActual]);

  const promocionesFiltradas = useMemo(() => {
    return (promociones || []).filter((p) => {
      const s = filtros.searchTerm.toLowerCase();
      const coincideBusqueda = p.nombre?.toLowerCase().includes(s) || p.descripcion?.toLowerCase().includes(s);
      const coincideTipo = filtros.filtroTipo === 'todos' || p.tipo === filtros.filtroTipo;
      const coincideAlcance = filtros.filtroAlcance === 'todos' || p.alcance === filtros.filtroAlcance;
      return coincideBusqueda && coincideTipo && coincideAlcance;
    });
  }, [promociones, filtros]);

  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const handleGuardar = () => {
    if (!promocionActual.nombre || !promocionActual.tipo || !promocionActual.valorDescuento) {
      toast.error('Completa los campos requeridos');
      return;
    }
    if (promocionActual.fechaInicio && promocionActual.fechaFin) {
      const ini = new Date(promocionActual.fechaInicio);
      const fin = new Date(promocionActual.fechaFin);
      if (fin < ini) {
        toast.error('La fecha fin no puede ser anterior a la fecha inicio');
        return;
      }
    }
    if (modoEdicion) {
      editarPromocion({
        id: promocionActual.id,
        datos: promocionActual
      });
    } else {
      crearPromocion(promocionActual);
    }
    setDialogoAbierto(false);
    setPromocionActual({
      nombre: '',
      descripcion: '',
      tipo: '',
      valorDescuento: '',
      fechaInicio: '',
      fechaFin: '',
      alcance: 'GENERAL',
      categoriaId: '',
      productoId: ''
    });
  };

  const handleEditar = (promocion) => {
    setPromocionActual(promocion);
    setModoEdicion(true);
    setDialogoAbierto(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <PageCabecera
          titulo="Gestión de Promociones"
          subtitulo="Administra promociones y descuentos"
          icono={Tag}
        />

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <BuscarInput
              value={filtros.searchTerm}
              onChange={(v) => actualizarFiltro('searchTerm', v)}
              placeholder="Buscar promociones por nombre o descripción..."
            />
            <FiltrarFIlas
              menuFiltrosAbierto={menuFiltrosAbierto}
              onToggleMenu={toggleMenuFiltros}
            >
              <SeleccionarFiltros
                value={filtros.filtroTipo}
                onChange={(e) => actualizarFiltro('filtroTipo', e.target.value)}
                options={[
                  { value: 'PORCENTAJE', label: 'Porcentaje' },
                  { value: 'MONTO_FIJO', label: 'Monto fijo' },
                  { value: '2X1', label: '2x1' },
                  { value: '3X2', label: '3x2' },
                ]}
                placeholder="Todos los tipos"
              />
              <SeleccionarFiltros
                value={filtros.filtroAlcance}
                onChange={(e) => actualizarFiltro('filtroAlcance', e.target.value)}
                options={[
                  { value: 'GENERAL', label: 'General' },
                  { value: 'TEMPORADA', label: 'Temporada' },
                  { value: 'PRODUCTO', label: 'Producto' },
                  { value: 'CATEGORIA', label: 'Categoría' },
                ]}
                placeholder="Todos los alcances"
              />
            </FiltrarFIlas>

            <div className="flex justify-end">
              <BotonAccion
                icon={Plus}
                label="Nueva Promoción"
                onClick={() => {
                  setModoEdicion(false);
                  setPromocionActual({
                    nombre: '', descripcion: '', tipo: '', valorDescuento: '', fechaInicio: '', fechaFin: '', alcance: 'GENERAL',
                    categoriaId: '', productoId: ''
                  });
                  setDialogoAbierto(true);
                }}
              />
            </div>
          </div>
        </div>

        <TablaPromociones
          promociones={promocionesFiltradas.slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina)}
          onEditar={handleEditar}
          onEliminar={eliminarPromocion}
        />

        {/* Paginación */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrar
            <select value={porPagina} onChange={(e) => { setPorPagina(parseInt(e.target.value)); setPagina(1); }} className="ml-2 border rounded px-2 py-1">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">por página</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} className="p-2 border rounded disabled:opacity-50" disabled={pagina === 1}>Anterior</button>
            <span className="text-sm">{pagina}</span>
            <button onClick={() => setPagina((p) => (p * porPagina < promocionesFiltradas.length ? p + 1 : p))} className="p-2 border rounded disabled:opacity-50" disabled={pagina * porPagina >= promocionesFiltradas.length}>Siguiente</button>
          </div>
        </div>

        <FormModal
          isOpen={dialogoAbierto}
          onClose={() => setDialogoAbierto(false)}
          title={modoEdicion ? 'Editar Promoción' : 'Crear Promoción'}
            formConfig={{
              defaultValues: promocionActual || { nombre: '', descripcion: '', tipo: '', valorDescuento: '', fechaInicio: '', fechaFin: '', alcance: 'GENERAL', categoriaId: '', productoId: '' }
            }}
          onSubmit={async (values) => {
            setDialogoAbierto(false);
            if (values.alcance === 'CATEGORIA' && !values.categoriaId) {
              toast.error('Selecciona una categoría para la promoción');
              return;
            }
            if (values.alcance === 'PRODUCTO' && !values.productoId) {
              toast.error('Selecciona un producto para la promoción');
              return;
            }
            // Mapear alcance a campos del backend
            const payload = { ...values };
            payload.aplicaTodo = values.alcance === 'GENERAL' || values.alcance === 'TEMPORADA';
            payload.aplicaCategoria = values.alcance === 'CATEGORIA';
            payload.aplicaProducto = values.alcance === 'PRODUCTO';
            payload.categoriaId = values.alcance === 'CATEGORIA' ? Number(values.categoriaId) || null : null;
            payload.productoId = values.alcance === 'PRODUCTO' ? Number(values.productoId) || null : null;
            // Se elimina el campo referencia: no se envían categoriaId/productoId
            // Normalizar valorDescuento para BOGO
            if (values.tipo === '2X1' || values.tipo === '3X2') {
              payload.valorDescuento = null;
            }

            if (modoEdicion && values.id) {
              await editarPromocion({ id: values.id, datos: payload });
            } else {
              await crearPromocion(payload);
            }
          }}
          acciones={(form, isLoading, onClose) => [
            <button key="cancelar" type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>,
            <button key="guardar" type="submit" disabled={!form.state.canSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{modoEdicion ? 'Actualizar' : 'Crear'}</button>
          ]}
        >
          {(form) => (
            <>
              <form.Field name="nombre" validators={{ onChange: ({ value }) => { if (!value) return 'Requerido' } }} children={(field) => (
                <FormInput field={field} label="Nombre" placeholder="Ej: Descuento fin de semana" />
              )} />

              <form.Field name="descripcion" children={(field) => (
                <FormInput field={field} label="Descripción" placeholder="Detalle de la promoción" />
              )} />

              <form.Field name="tipo" validators={{ onChange: ({ value }) => { if (!value) return 'Seleccione un tipo' } }} children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={field.state.value}
                    onChange={(e) => {
                      const v = e.target.value
                      field.handleChange(v)
                      // Si el usuario cambia a 2x1/3x2, limpiar el valor de descuento
                      if (v === '2X1' || v === '3X2') {
                        form.setFieldValue('valorDescuento', '')
                      }
                    }}
                  >
                    <option value="">Seleccionar</option>
                    <option value="PORCENTAJE">Porcentaje</option>
                    <option value="MONTO_FIJO">Monto Fijo</option>
                    <option value="2X1">2x1</option>
                    <option value="3X2">3x2</option>
                  </select>
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )} />

              <form.Field name="alcance" children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alcance</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={field.state.value}
                    onChange={(e) => {
                      const valor = e.target.value
                      field.handleChange(valor)
                      setAlcanceSeleccionado(valor)
                      if (valor !== 'CATEGORIA') {
                        form.setFieldValue('categoriaId', '')
                      }
                      if (valor !== 'PRODUCTO') {
                        form.setFieldValue('productoId', '')
                      }
                    }}
                  >
                    <option value="GENERAL">General</option>
                    <option value="TEMPORADA">Temporada</option>
                    <option value="PRODUCTO">Producto</option>
                    <option value="CATEGORIA">Categoría</option>
                  </select>
                </div>
              )} />

              {alcanceSeleccionado === 'CATEGORIA' && (
                <form.Field name="categoriaId" children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                      ))}
                    </select>
                  </div>
                )} />
              )}

              {alcanceSeleccionado === 'PRODUCTO' && (
                <form.Field name="productoId" children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                      ))}
                    </select>
                  </div>
                )} />
              )}

              {/* Campo 'referencia' eliminado por no usarse en la base de datos */}

              <form.Field
                name="valorDescuento"
                validators={{
                  onChange: () => {
                    const tipo = form.state.values.tipo
                    const v = form.state.values.valorDescuento
                    if (tipo === 'PORCENTAJE') {
                      if (v === '' || v === null || v === undefined) return 'Ingrese un porcentaje'
                      const n = Number(v)
                      if (!Number.isFinite(n)) return 'Porcentaje inválido'
                      if (n <= 0 || n > 100) return 'Debe estar entre 1 y 100'
                    } else if (tipo === 'MONTO_FIJO') {
                      if (v === '' || v === null || v === undefined) return 'Ingrese un monto'
                      const n = Number(v)
                      if (!Number.isFinite(n)) return 'Monto inválido'
                      if (n <= 0) return 'Debe ser mayor a 0'
                    } else if (tipo === '2X1' || tipo === '3X2') {
                      // No requerido
                      return undefined
                    } else {
                      return 'Seleccione un tipo'
                    }
                  }
                }}
                children={(field) => {
                  const tipo = form.state.values.tipo
                  const isBogo = tipo === '2X1' || tipo === '3X2'
                  const isPorcentaje = tipo === 'PORCENTAJE'
                  const label = isPorcentaje
                    ? 'Porcentaje (%)'
                    : tipo === 'MONTO_FIJO'
                      ? 'Monto fijo ($)'
                      : 'Valor de descuento'
                  const placeholder = isPorcentaje
                    ? 'Ej: 10 (usa 10 para 10%)'
                    : tipo === 'MONTO_FIJO'
                      ? 'Ej: 1500'
                      : 'No requerido para 2x1 / 3x2'

                  return (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="number"
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isBogo}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          isBogo
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                            : field.state.meta.errors?.length > 0
                              ? 'border-red-400 focus:ring-red-300'
                              : 'border-gray-300 focus:ring-blue-400'
                        }`}
                        placeholder={placeholder}
                      />
                      {tipo === '2X1' && (
                        <p className="text-xs text-gray-500 mt-1">No requiere valor. Equivale aprox. a 50% por pares.</p>
                      )}
                      {tipo === '3X2' && (
                        <p className="text-xs text-gray-500 mt-1">No requiere valor. Equivale aprox. a 33,3% por ternas.</p>
                      )}
                      {field.state.meta.errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )
                }}
              />

              

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="fechaInicio" children={(field) => (
                  <FormInput field={field} type="date" label="Fecha Inicio" />
                )} />
                <form.Field name="fechaFin" children={(field) => (
                  <FormInput field={field} type="date" label="Fecha Fin" />
                )} />
              </div>
            </>
          )}
        </FormModal>
      </div>
    </div>
  );
};
