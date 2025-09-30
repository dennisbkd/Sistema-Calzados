import { useForm } from "@tanstack/react-form"
import { PasswordMutation } from "../hooks/PasswordMutation"
import { Loader2, Lock } from "lucide-react"
import { useSearchParams, NavLink } from "react-router"

export const RestablecerPassword = () => {
  const mutation = PasswordMutation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const form = useForm({
    defaultValues: { nuevaPassword: "", token },
    onSubmit: ({ value }) => {
      mutation.mutate({ value })
      form.reset()
    },
  })

  if (!token) return <p>Token inválido o expirado</p>


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 animate-fadeIn">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100 space-y-6">

        {/* Header con imagen */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <img
              src="/mascotaFeliz.png"
              alt="Mascota feliz"
              className="w-40 h-auto relative z-10"
            />
            <div className="absolute inset-0 w-40 h-40 bg-amber-100 rounded-full blur-2xl opacity-60 -z-0" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Restablecer contraseña
          </h2>
          <p className="text-sm text-gray-500">
            Ingresa tu nueva contraseña para continuar
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="nuevaPassword"
            validators={{
              onChange: ({ value }) => {
                if (value.length < 5) return 'la nueva Contraseña es demasiado corta'
              }
            }}
            children={(field) => (
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 transition
                      ${field.state.meta.errors
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 focus:ring-blue-400"
                      }`}
                    placeholder="••••••••"
                  />
                </div>
                {field.state.meta.errors && (
                  <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
                )}
              </div>
            )}
          />

          <div className="flex gap-x-2">
            <p className="text-sm mt-2">Inicia Sesión</p>
            <NavLink className="text-sm mt-2 border-b-1 border-blue-600 text-blue-800" to="/">Ingresar</NavLink>
          </div>

          {/* Botón */}
          <button
            disabled={mutation.isPending}
            type="submit"
            className={`w-full flex items-center justify-center gap-2 
              bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition
              ${mutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 active:scale-[0.98]"
              }`}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Confirmar nueva contraseña"
            )}
          </button>
        </form>
      </div >
    </div >
  )
}