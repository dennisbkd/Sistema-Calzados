import { useState } from "react";
import { registrarPagoCompra, getTransacciones, getPagosPorCompra, getResumenCompra } from "../../api/pago/transaccionPagoApi";

export default function usePagos(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lista, setLista] = useState([]);
  const [resumen, setResumen] = useState(null);

  async function listar(params={}){
    setLoading(true); setError(null);
    try{
      const data = await getTransacciones(params);
      const items = Array.isArray(data?.items)? data.items : Array.isArray(data)? data : [];
      setLista(items);
      return items;
    }catch(e){ setError(e); throw e; } finally{ setLoading(false); }
  }

  async function pagosPorCompra(compraId){
    setLoading(true); setError(null);
    try{ return await getPagosPorCompra(compraId); }catch(e){ setError(e); throw e; } finally{ setLoading(false); }
  }

  async function resumenCompra(compraId){
    setLoading(true); setError(null);
    try{ const data = await getResumenCompra(compraId); setResumen(data); return data; }catch(e){ setError(e); throw e; } finally{ setLoading(false); }
  }

  async function registrarCompra(payload){ return await registrarPagoCompra(payload); }

  return { loading, error, lista, resumen, listar, pagosPorCompra, resumenCompra, registrarCompra };
}
