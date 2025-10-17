import { X } from "lucide-react";
import { motion } from "motion/react";

export const Modal = ({
  abierto, cambiarEstado, titulo, children, size = "md"
}) => {

  if (!abierto) return null

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  }
  return (
    <div
      onClick={() => cambiarEstado()}
      className="fixed inset-0 backdrop-blur-sm flex items-center 
      justify-center p-4 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-xl w-full ${sizes[size]} max-h-[90vh] border border-gray-200 shadow-lg  overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 ">
              {titulo}
            </h3>
            <button className="text-blue-600 hover:text-blue-800 mt-2 text-sm cursor-pointer" onClick={() => cambiarEstado()}><X /></button>
          </div>
          {children}
        </div>
      </motion.div>

    </div>
  )
}
