import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

type Role = 'admin' | 'vendedor' | 'caja'

interface User {
  id: number
  nombre: string
  rol: Role
  correo: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (correo: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const savedToken = await AsyncStorage.getItem('token')
      const savedUser = await AsyncStorage.getItem('user')
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    }
    load()
  }, [])

const login = async (correo: string, password: string) => {
  try {
    const res = await api.post('/login', { correo, password })
    console.log('✅ Login exitoso:', res.data)
    const { token, user } = res.data
    setToken(token)
    setUser(user)
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('❌ Error en login:', error)
    throw error
  }
}


  const logout = async () => {
    setToken(null)
    setUser(null)
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
