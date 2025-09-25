import { SideBar } from "./SideBar"
import { Outlet } from "react-router-dom"

export const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}








