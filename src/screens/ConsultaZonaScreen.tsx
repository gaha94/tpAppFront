import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import api from '../services/api'

export default function ConsultaZonaScreen() {
  const [sucursales, setSucursales] = useState<any[]>([])
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null)
  const [desde, setDesde] = useState(new Date())
  const [hasta, setHasta] = useState(new Date())
  const [mostrarPicker, setMostrarPicker] = useState<'desde' | 'hasta' | null>(null)
  const [ventas, setVentas] = useState<any[]>([])

  useEffect(() => {
    api.get('/sucursales')
      .then(res => setSucursales(res.data))
      .catch(err => console.error('Error al obtener sucursales:', err))
  }, [])

  const buscarVentas = async () => {
    if (!sucursalSeleccionada) return
    const desdeStr = desde.toISOString().split('T')[0]
    const hastaStr = hasta.toISOString().split('T')[0]

    try {
      const res = await api.get('/ventas/por-zona', {
        params: {
          sucursal_id: sucursalSeleccionada,
          desde: desdeStr,
          hasta: hastaStr
        }
      })
      setVentas(res.data)
    } catch (error) {
      console.error('Error al buscar ventas:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sucursal:</Text>
      {sucursales.map(s => (
        <TouchableOpacity
          key={s.id}
          style={[
            styles.sucursalItem,
            sucursalSeleccionada === s.id && styles.sucursalSeleccionada
          ]}
          onPress={() => setSucursalSeleccionada(s.id)}
        >
          <Text style={styles.sucursalTexto}>{s.nombre}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Desde:</Text>
      <TouchableOpacity onPress={() => setMostrarPicker('desde')}>
        <Text style={styles.fechaTexto}>{desde.toDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hasta:</Text>
      <TouchableOpacity onPress={() => setMostrarPicker('hasta')}>
        <Text style={styles.fechaTexto}>{hasta.toDateString()}</Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={mostrarPicker === 'desde' ? desde : hasta}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setMostrarPicker(null)
            if (!date) return
            mostrarPicker === 'desde' ? setDesde(date) : setHasta(date)
          }}
        />
      )}

      <Button title="Buscar ventas" onPress={buscarVentas} />

      <FlatList
        data={ventas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ventaItem}>
            <Text>ID: {item.id}</Text>
            <Text>Comprobante: {item.tipoComprobante}</Text>
            <Text>Vendedor: {item.vendedor}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  sucursalItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    borderRadius: 5,
  },
  sucursalSeleccionada: {
    backgroundColor: '#007bff',
  },
  sucursalTexto: {
    color: '#000',
  },
  fechaTexto: {
    padding: 10,
    backgroundColor: '#eee',
    marginVertical: 5,
    borderRadius: 5,
  },
  ventaItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
})
