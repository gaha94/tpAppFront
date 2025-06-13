import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'


const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Asegúrate que esté accesible desde el celular o emulador
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token')
  if (!token) return config
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
