import React from 'react';
import { formatCurrency } from '../../../global/utils/formatCurrency';
import { ListaVacia } from '../../../global/components/ListaVacia';

export const TablaHistorialVentas = ({ ventas }) => {
  if (!ventas || ventas.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg">
        <ListaVacia titulo="No se encontraron ventas" />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="text-left p-4 font-semibold">#</th>
            <th className="text-left p-4 font-semibold">Fecha</th>
            <th className="text-left p-4 font-semibold">Cliente</th>
            <th className="text-left p-4 font-semibold">Empleado</th>
            <th className="text-left p-4 font-semibold">Estado</th>
            <th className="text-left p-4 font-semibold">Total</th>
            <th className="text-left p-4 font-semibold">Detalle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ventas?.map((venta) => (
            <tr key={venta.id} className="hover:bg-blue-50 transition-colors">
              <td className="p-4">{venta.nroFactura || venta.id}</td>
              <td className="p-4">{new Date(venta.createdAt).toLocaleDateString()}</td>
              <td className="p-4">{venta.cliente?.nombre || 'N/A'}</td>
              <td className="p-4">{venta.usuario?.nombre || 'N/A'}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${venta.estado === 'PAGADA' ? 'bg-green-100 text-green-700 border border-green-200' : venta.estado === 'ANULADA' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>{venta.estado}</span>
              </td>
              <td className="p-4">{formatCurrency(venta.total)}</td>
              <td className="p-4">
                <details>
                  <summary className="cursor-pointer text-blue-600">Ver detalles</summary>
                  <div className="mt-2">
                    <table className="w-full border rounded">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Producto</th>
                          <th className="text-left p-2">Cantidad</th>
                          <th className="text-left p-2">Precio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {venta.detalles?.map((detalle) => (
                          <tr key={detalle.id}>
                            <td className="p-2">{`${detalle?.variante?.producto?.nombre || 'Producto'} ${detalle?.variante?.talla || ''} ${detalle?.variante?.color || ''}`}</td>
                            <td className="p-2">{detalle.cantidad}</td>
                            <td className="p-2">{formatCurrency(detalle.precioUnitario)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
