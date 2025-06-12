import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { useAuth } from '../contexts/AuthContext'

export default function LoginScreen() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      await login(correo, password)
      Alert.alert('Éxito', 'Has iniciado sesión')
      // Navegar a pantalla principal aquí
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput placeholder="Correo" style={styles.input} onChangeText={setCorreo} />
      <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry onChangeText={setPassword} />
      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
})
