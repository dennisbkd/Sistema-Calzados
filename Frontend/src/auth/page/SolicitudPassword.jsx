
import { Loader2, Mail } from "lucide-react"
import { NavLink } from "react-router";
import { useForm } from "@tanstack/react-form";
import { RecuperacionMutation } from "../hooks/RecuperacionMutation";

export const SolicitudPassword = () => {

  const mutation = RecuperacionMutation()

  const form = useForm({
    defaultValues: {
      email: ''
    },
    onSubmit: ({ value }) => {
      mutation.mutate({ value })
      form.reset()
    }
  })


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-6 bg-gradient-to-t grid gap-y-2 rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
        {/* Header */}
        <div className="flex justify-center mb-6 relative">
          <img
            src="/mascota.png"
            alt="Forgot Password Illustration"
            className="w-64 h-auto z-50"
          />
          <img
            src="/fondo.svg"
            alt="Forgot Password Illustration"
            className="w-64 h-auto absolute"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Solicitar contraseña</h2>
        <p className="text-gray-500 mt-1 mb-6 text-sm">
          si no recuerda su contraseña, ingrese su correo electronico.
        </p>

        {/* Form */}
        <form onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ingrese su Correo Electronico
            </label>
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 5)
                    return 'Correo demasiado corto'
                }
              }}
              children={(field) => (
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="ejemplo123@gmail.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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

            <div className="flex gap-x-2">
              <p className="text-sm mt-2">Recuerda su Contraseña ?</p>
              <NavLink className="text-sm mt-2 border-b-1 border-blue-600 text-blue-800" to="/">Ingresar</NavLink>
            </div>
          </div>

          <button
            disabled={mutation.isPending}
            type="submit"
            className={`w-full flex items-center justify-center gap-2 
          bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition
          ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Solicitud"
            )}
          </button>

        </form>
      </div>
    </div>
  )
}
