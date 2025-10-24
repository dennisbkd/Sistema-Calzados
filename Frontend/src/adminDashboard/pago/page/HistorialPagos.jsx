import React, { useEffect, useState } from "react";
import usePagos from "../hooks/usePagos";
import TablaPagos from "../components/TablaPagos";
import ResumenPagos from "../components/ResumenPagos";

export default function HistorialPagos(){
  const { listar } = usePagos();
  const [items, setItems] = useState([]);
  useEffect(()=>{ listar().then(setItems).catch(console.error); }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Historial de Pagos</h2>
      <ResumenPagos datos={{ hoy: 0, semana: 0, mes: 0, pendiente: 0 }} />
      <TablaPagos items={items} />
    </div>
  )
}
