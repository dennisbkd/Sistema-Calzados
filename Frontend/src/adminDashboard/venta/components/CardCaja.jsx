"use client"
import { motion } from "motion/react"

export const CardCaja = ({ label, value, accent = "primary" }) => {
  const variantes = {
    primary: "border-blue-100",
    success: "border-green-200",
    danger: "border-red-200"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border ${variantes[accent] || variantes.primary} shadow-sm p-6 space-y-1`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800">Bs {Number(value || 0).toFixed(2)}</p>
    </motion.div>
  )
}
