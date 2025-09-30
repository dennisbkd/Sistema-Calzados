import instancia from "../../../config/axios.js"

export const IniciarSesion = async ({value}) => {
  const response = await instancia.post('/autorizacion/login',value)

  return response.data
}

export const Recuperacion = async ({value}) => {
  const response = await instancia.post('/autorizacion/solicitar-recuperamiento', value)

  return response.data
}

export const NuevaClave = async ({value}) => {
  console.log(value)
  const response = await instancia.post('/autorizacion/restablecer-password', value)
  
  return response.data
}