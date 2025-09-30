import { Eye, LogIn } from "lucide-react"
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Authmutation } from "../hooks/Authmutation";
import { NavLink } from "react-router";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const mutation = Authmutation()

  const form = useForm({
    defaultValues: {
      nombre: '',
      password: ''
    },
    onSubmit: ({ value }) => {
      mutation.mutate({ value })
    }
  })
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
        className="space-y-4">

        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => {
              if (value.length < 3) return 'nombre tiene que ser mayor 3 caracteres'
            }
          }}
          children={(field) => (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre de Usuario</label>
              <input
                id="nombre"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {
                field.state.meta.errors && (
                  <div className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors}
                  </div>
                )
              }
            </div>
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        />
        <div className="flex gap-x-2">
          <p className="text-sm">Problmas al iniciar sesión?</p>
          <NavLink className="text-sm text-blue-800 border-b-1 border-blue-800" to='/solicitar-recuperamiento'>Solicitar</NavLink>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white mt-2 font-semibold py-2 px-4 rounded-lg transition"
        >
          <LogIn className="h-5 w-5" /> Iniciar Sesión
        </button>
      </form>
      <p className="mt-6 text-xs text-gray-500 text-center">
        Credenciales de prueba: <b>Admin Principal / admin1234</b>
      </p>
    </div>
  )
}
