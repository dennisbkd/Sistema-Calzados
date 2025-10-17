import { CheckCircle, XCircle } from 'lucide-react'

export const BotonIcon = ({ isLoading, onSubmit, icon: Icon = null, color, titulo, data, activo = null, size }) => {
  const esBooleano = typeof activo === 'boolean'

  return (
    <button disabled={isLoading || false} onClick={() => onSubmit(data)} className="p-2 transition-colors" title={titulo}>
      {Icon && <Icon size={size || 16} className={`text-${color}-600 hover:text-${color}-900`} />}
      {esBooleano && (activo ?
        <CheckCircle size={size || 16} className={`text-${color}-600 hover:text-${color}-900`} /> :
        <XCircle size={size || 16} className={`text-${color}-600 hover:text-${color}-900`} />)}
    </button>
  )
}

