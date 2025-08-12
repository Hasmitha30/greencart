import axios from 'axios'
const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const api = axios.create({ baseURL: base })

api.interceptors.request.use(cfg=>{
  const token = localStorage.getItem('gc_token')
  if(token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
