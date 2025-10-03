/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "motion/react"
import { SideBar } from "./SideBar"
import { Outlet, useLocation } from "react-router"

export const DashboardPage = () => {
  const location = useLocation()

  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 bg-gray-50 overflow-auto">
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}








