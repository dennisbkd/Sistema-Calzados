/* eslint-disable no-unused-vars */
import { motion } from "motion/react"

export const PageCabecera = ({
  titulo,
  subtitulo,
  icono: Icon,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 sm:mb-8 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Icon className="text-white" size={20} />
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{titulo}</h1>
          {subtitulo && <p className="text-gray-600 text-sm sm:text-base">{subtitulo}</p>}
        </div>
      </div>
      <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
    </motion.div>
  )
}