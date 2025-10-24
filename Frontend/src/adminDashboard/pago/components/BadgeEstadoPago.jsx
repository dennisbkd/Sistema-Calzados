import { motion } from "motion/react"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

export const BadgeEstadoPago = ({ estado, className = "" }) => {
  const getEstadoConfig = () => {
    switch (estado) {
      case 'PAGADA':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: CheckCircle,
          label: 'Pagado'
        }
      case 'PAGO_PARCIAL':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          icon: Clock,
          label: 'Pago Parcial'
        }
      case 'REGISTRADA':
      default:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300',
          icon: AlertCircle,
          label: 'Pendiente'
        }
    }
  }

  const config = getEstadoConfig()
  const Icon = config.icon

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </motion.span>
  )
}