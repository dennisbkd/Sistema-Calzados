import React from "react";

export function FormMetodoPago({ values, onChange, onSubmit, onCancel, submitLabel='Guardar' }){
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.();}} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input name="nombre" value={values.nombre||''} onChange={onChange}
          className="w-full rounded-lg border px-3 py-2 outline-none" placeholder="Efectivo / Tarjeta / QR" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <input name="descripcion" value={values.descripcion||''} onChange={onChange}
          className="w-full rounded-lg border px-3 py-2 outline-none" placeholder="Opcional" />
      </div>
      <div className="flex items-center gap-2">
        <input id="activo" type="checkbox" name="activo" checked={!!values.activo} onChange={onChange} />
        <label htmlFor="activo">Activo</label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-lg border">Cancelar</button>
        <button type="submit" className="px-3 py-2 rounded-lg border"> {submitLabel} </button>
      </div>
    </form>
  )
}
