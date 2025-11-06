import React, { useState } from 'react';
import { Pencil, Trash2, Tag } from 'lucide-react';

export const TablaPromociones = ({ promociones, onEditar, onEliminar }) => {
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);

  const handleEliminar = () => {
    if (!promocionSeleccionada) return;
    const ok = window.confirm('¿Estás seguro de eliminar esta promoción?');
    if (ok) onEliminar(promocionSeleccionada.id);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="text-left p-4 font-semibold">Nombre</th>
            <th className="text-left p-4 font-semibold">Descripción</th>
            <th className="text-left p-4 font-semibold">Tipo</th>
            <th className="text-left p-4 font-semibold">Alcance</th>
            <th className="text-left p-4 font-semibold">Referencia</th>
            <th className="text-left p-4 font-semibold">Valor</th>
            <th className="text-left p-4 font-semibold">Fecha Inicio</th>
            <th className="text-left p-4 font-semibold">Fecha Fin</th>
            <th className="text-left p-4 font-semibold">Estado</th>
            <th className="text-left p-4 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {promociones?.map((promocion) => (
            <tr key={promocion.id} className="hover:bg-blue-50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Tag className="text-blue-600" size={18} />
                  </div>
                  <div className="font-semibold text-gray-800">{promocion.nombre}</div>
                </div>
              </td>
              <td className="p-4">{promocion.descripcion}</td>
              <td className="p-4">{promocion.tipo}</td>
              <td className="p-4">{promocion.alcance || 'GENERAL'}</td>
              <td className="p-4">{promocion.referencia || '-'}</td>
              <td className="p-4">
                {promocion.tipo === 'PORCENTAJE' && promocion.valorDescuento != null && promocion.valorDescuento !== ''
                  ? `${promocion.valorDescuento}%`
                  : promocion.tipo === 'MONTO_FIJO' && promocion.valorDescuento != null && promocion.valorDescuento !== ''
                    ? `$ ${promocion.valorDescuento}`
                    : '—'}
              </td>
              <td className="p-4">{promocion.fechaInicio}</td>
              <td className="p-4">{promocion.fechaFin}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${promocion.activa ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                  {promocion.activa ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-2 rounded border text-blue-600 hover:bg-blue-50"
                    title="Editar"
                    onClick={() => onEditar(promocion)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="px-3 py-2 rounded border text-red-600 hover:bg-red-50"
                    title="Eliminar"
                    onClick={() => {
                      setPromocionSeleccionada(promocion);
                      handleEliminar();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
