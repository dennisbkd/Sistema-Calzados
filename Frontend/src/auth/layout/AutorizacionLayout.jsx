/* eslint-disable no-unused-vars */
import { useState } from "react";
import { UserPlus, Footprints } from "lucide-react";
import { motion } from "motion/react";
import { LoginPage } from "../page/LoginPage";

export default function AutorizacionLayout() {
  const [tab, setTab] = useState("login");



  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-lg bg-white">
        {/* Left Section (fixed image/panel) */}
        <div className="flex flex-col items-center justify-center text-white p-10 bg-gradient-to-b from-blue-700 to-blue-500">
          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: [-10, 10, -10] // Movimiento de flotación suave
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white rounded-full p-4 mb-4">
              <Footprints className="h-12 w-12 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Bienvendo a</h1>
          <h2 className="text-3xl font-extrabold mb-4">calzados al paso</h2>
          <p className="text-center max-w-sm opacity-80">
            Sistema de información para la gestion de inventario, compras y ventas para la tienda de calzados
          </p>
        </div>

        {/* Right Section with Tabs */}
        <div className="flex flex-col justify-center p-10">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50 rounded-lg overflow-hidden mb-6">
            <button
              onClick={() => setTab("login")}
              className={`w-1/2 py-3 font-semibold transition ${tab === "login"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-gray-400"
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setTab("register")}
              className={`w-1/2 py-3 font-semibold transition ${tab === "register"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-gray-400"
                }`}
            >
              Crear Cuenta
            </button>
          </div>

          {tab === "login" && (
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
              <p className="text-gray-500 mb-6">Accede a tu cuenta</p>
              <LoginPage />
            </motion.div>
          )}

          {tab === "register" && (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-2xl font-bold mb-2">Crear Cuenta</h2>
              <p className="text-gray-500 mb-6">Únete a nuestra comunidad</p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Ingresa tu nombre completo"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Crea una contraseña segura"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirma tu contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  <UserPlus className="h-5 w-5" /> Crear Cuenta
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
