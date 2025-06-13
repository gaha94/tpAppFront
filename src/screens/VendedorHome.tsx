import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function VendedorHome() {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null)
  const navigation = useNavigation()

  const handleSeleccion = (i: number) => {
    setOpcionSeleccionada(i)
    if (i === 1) {
      navigation.navigate('VentasDia' as never)
    } else if (i === 2) {
      navigation.navigate('ConsultaZona' as never)
    }
  }

  const renderContenido = () => {
    switch (opcionSeleccionada) {
      case 3:
        return (
          <View style={styles.contenido}>
            <Text>Consulta por clientes (próximamente)</Text>
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => {
        const titulos = ['Venta Horizontal', 'Consulta por Zonas', 'Consulta por Clientes']
        const isSelected = opcionSeleccionada === i

        return (
          <TouchableOpacity
            key={i}
            style={[styles.card, isSelected && styles.cardActiva]}
            onPress={() => handleSeleccion(i)}
          >
            <Text style={[styles.cardTitulo, isSelected && styles.cardTituloActiva]}>
              {i}. {titulos[i - 1]}
            </Text>
            <Text style={styles.cardTexto}>
              Ventas.
            </Text>
          </TouchableOpacity>
        )
      })}
      {renderContenido()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardActiva: {
    backgroundColor: '#007bff',
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTituloActiva: {
    color: '#fff',
  },
  cardTexto: {
    marginTop: 5,
    color: '#666',
  },
  contenido: {
    marginTop: 20,
  },
})
