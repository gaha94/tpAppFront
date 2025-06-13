import React, { useEffect, useState } from 'react'
import { View, Text, Button, FlatList, StyleSheet } from 'react-native'
import api from '../services/api'
import { useNavigation } from '@react-navigation/native'

interface Venta {
  id: number
  cliente: string
  total: number
  estado: string
  fecha: string
}

export default function VentasDiaScreen() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const navigation = useNavigation()

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await api.get('/ventas/dia') // ajusta la ruta si es diferente
        setVentas(res.data)
      } catch (err) {
        console.error('Error al obtener ventas del día:', err)
      }
    }

    fetchVentas()
  }, [])

  return (
    <View style={styles.container}>
      <Button title="➕ Nueva Venta" onPress={() => navigation.navigate('NuevaVenta' as never)} />

      <Text style={styles.titulo}>Ventas del Día</Text>

      <FlatList
        data={ventas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Cliente: {item.cliente}</Text>
            <Text>Total: S/ {item.total.toFixed(2)}</Text>
            <Text>Estado: {item.estado}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  titulo: { fontSize: 18, marginVertical: 10, fontWeight: 'bold' },
  item: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
})
