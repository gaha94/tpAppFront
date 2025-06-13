import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import VendedorHome from '../screens/VendedorHome'
import CajaHome from '../screens/CajaHome'
import AdminHome from '../screens/AdminHome'
import VentasDiaScreen from '../screens/VentasDiaScreen'
import NuevaVentaScreen from '../screens/NuevaVentaScreen'
import { useAuth } from '../contexts/AuthContext'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  const { user } = useAuth()

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      {user.rol === 'vendedor' ? (
        <Stack.Navigator>
          <Stack.Screen name="Inicio" component={VendedorHome} />
          <Stack.Screen name="VentasDia" component={VentasDiaScreen} />
          <Stack.Screen name="NuevaVenta" component={NuevaVentaScreen} />
        </Stack.Navigator>
      ) : user.rol === 'caja' ? (
        <Stack.Navigator>
          <Stack.Screen name="Inicio" component={CajaHome} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Inicio" component={AdminHome} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}
