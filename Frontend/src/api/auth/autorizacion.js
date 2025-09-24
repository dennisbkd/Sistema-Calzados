import instancia from "../../../config/axios.js"

export const IniciarSesion = async ({value}) => {
  console.log(value)
  const response = await instancia.post('/autorizacion/login',value)

  return response.data
}