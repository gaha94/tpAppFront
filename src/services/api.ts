import axios from 'axios'

const api = axios.create({
  baseURL: 'http://TU_IP_LOCAL:3001/api', // Asegúrate que esté accesible desde el celular o emulador
})

export default api
