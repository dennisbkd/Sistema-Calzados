import React, { useMemo, useState } from 'react';
import { TablaHistorialVentas } from '../components/TablaHistorialVentas';
import { useHistorialVentas } from '../hooks/useHistorialVentas';
import { BotonAccion } from '../../../global/components/Boton/BotonAccion';
import { Search, ShoppingCart } from 'lucide-react';
import { PageCabecera } from '../../../global/components/cabecera/PageCabecera';
import { AutocompleteInput } from '../../../global/components/filtros/AutocompleteInput';
import { FiltrarFIlas } from '../../../global/components/filtros/FiltrarFIlas';
import { SeleccionarFiltros } from '../../../global/components/filtros/SeleccionarFiltros';
import { useFiltros } from '../../../global/hooks/useFiltros';

export const HistorialVentas = () => {
  const { ventas = [], filtros, actualizarFiltros, isLoading, buscar } = useHistorialVentas();
  const { filtros: filtrosUI, menuFiltrosAbierto, actualizarFiltro, toggleMenuFiltros } = useFiltros({
    criterio: 'empleadoNombre'
  });

  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const onBuscarClick = () => {
    const base = { ...filtros };
    actualizarFiltros(base);
    setTimeout(() => buscar(), 0);
  };

  const handleFiltroChange = (campo, valor) => {
    actualizarFiltros({ [campo]: valor });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <PageCabecera titulo="Historial de Ventas" subtitulo="Consulta y filtra ventas" icono={ShoppingCart} />

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <AutocompleteInput
              value={filtrosUI.searchTerm}
              onChange={(v) => actualizarFiltro('searchTerm', v)}
              placeholder={filtrosUI.criterio === 'empleadoNombre' ? 'Buscar empleado por nombre...' : 'Buscar cliente por nombre...'}
              fetchOptions={async (term) => {
                if (filtrosUI.criterio === 'empleadoNombre') {
                  // Usa lista de usuarios como fuente de empleados
                  try {
                    const mod = await import('../../../api/usuarioApi')
                    const usuarios = await mod.listar()
                    const unique = []
                    const seen = new Set()
                    for (const u of usuarios) {
                      const label = u.nombre || ''
                      if (label.toLowerCase().includes(term.toLowerCase())) {
                        if (!seen.has(label)) { seen.add(label); unique.push({ id: u.id, label }) }
                      }
                    }
                    return unique
                  } catch { return [] }
                }
                // Clientes: usa nombres presentes en ventas como sugerencia rápida
                const names = new Set()
                const opts = []
                ;(ventas || []).forEach(v => {
                  const label = v?.cliente?.nombre || ''
                  if (label && label.toLowerCase().includes(term.toLowerCase()) && !names.has(label)) {
                    names.add(label); opts.push({ id: label, label })
                  }
                })
                return opts
              }}
            />

            <FiltrarFIlas menuFiltrosAbierto={menuFiltrosAbierto} onToggleMenu={toggleMenuFiltros}>
              <SeleccionarFiltros
                value={filtrosUI.criterio}
                onChange={(e) => actualizarFiltro('criterio', e.target.value)}
                options={[
                  { value: 'clienteNombre', label: 'Cliente (nombre)' },
                  { value: 'empleadoNombre', label: 'Empleado (nombre)' },
                ]}
                placeholder="Criterio de búsqueda"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input className="w-full border rounded-lg px-3 py-2" type="date" value={filtros.fechaInicio} onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input className="w-full border rounded-lg px-3 py-2" type="date" value={filtros.fechaFin} onChange={(e) => handleFiltroChange('fechaFin', e.target.value)} />
              </div>
              <SeleccionarFiltros
                value={filtros.estado || ''}
                onChange={(e) => handleFiltroChange('estado', e.target.value === 'todos' ? '' : e.target.value)}
                options={[
                  { value: 'PAGADA', label: 'Pagada' },
                  { value: 'ANULADA', label: 'Anulada' },
                  { value: 'REGISTRADA', label: 'Registrada' }
                ]}
                placeholder="Todos los estados"
              />
              <div className="flex items-end">
                <BotonAccion icon={Search} label="Buscar" onClick={onBuscarClick} />
              </div>
            </FiltrarFIlas>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6">Cargando...</div>
        ) : (
          <>
          <TablaHistorialVentas
            ventas={(ventas || []).filter((v) => {
              // Filtro por estado (cliente)
              if (filtros.estado && v.estado !== filtros.estado) return false;

              // Búsqueda por criterio seleccionado
              const term = (filtrosUI.searchTerm || '').toLowerCase().trim();
              if (!term) return true;
              switch (filtrosUI.criterio) {
                case 'clienteNombre':
                  return (v.cliente?.nombre || '').toLowerCase().includes(term);
                case 'empleadoNombre':
                  return (v.usuario?.nombre || '').toLowerCase().includes(term);
                default:
                  return true;
              }
            }).slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina)}
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
              <button onClick={() => setPagina((p) => (p * porPagina < (ventas || []).length ? p + 1 : p))} className="p-2 border rounded disabled:opacity-50" disabled={pagina * porPagina >= (ventas || []).length}>Siguiente</button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};
