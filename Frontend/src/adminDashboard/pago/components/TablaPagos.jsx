import React from "react";

export default function TablaPagos({ items = [] }){
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-3 py-2 text-left">Fecha</th>
            <th className="px-3 py-2 text-left">Compra</th>
            <th className="px-3 py-2 text-left">Método</th>
            <th className="px-3 py-2 text-right">Monto</th>
            <th className="px-3 py-2 text-left">Ref.</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p)=> (
            <tr key={p.id} className="border-t">
              <td className="px-3 py-2">{p.fecha?.slice?.(0,10) || p.createdAt?.slice?.(0,10)}</td>
              <td className="px-3 py-2">#{p.compraId}</td>
              <td className="px-3 py-2">{p.metodoPago?.nombre || p.metodoPagoNombre || p.metodoPagoId}</td>
              <td className="px-3 py-2 text-right">Bs. {Number(p.monto||0).toFixed(2)}</td>
              <td className="px-3 py-2">{p.referencia||'-'}</td>
            </tr>
          ))}
          {items.length===0 && (
            <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={5}>Sin pagos</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
