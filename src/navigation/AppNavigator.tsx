import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import VendedorHome from '../screens/VendedorHome'
import CajaHome from '../screens/CajaHome'
import AdminHome from '../screens/AdminHome'
import { useAuth } from '../contexts/AuthContext'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  const { user } = useAuth()

  // Si no ha iniciado sesión, mostrar Login
  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  // Redirigir según el rol
  let HomeComponent = VendedorHome
  if (user.rol === 'caja') HomeComponent = CajaHome
  else if (user.rol === 'admin') HomeComponent = AdminHome

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
