import axios from "axios";

 const instancia = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:3000',
  withCredentials: true
})

instancia.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
},
(error)=> Promise.reject(error)
)

export default instancia