/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { useLocation } from "react-router"


export const TrancisionPages = ({ children }) => {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: 20, scale: 0.99 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 1.01 }}
      transition={{
        duration: 0.35,
        ease: [0.33, 1, 0.68, 1] // easeOutCubic - muy fluido
      }}
    >
      {children}
    </motion.div>
  )
}
