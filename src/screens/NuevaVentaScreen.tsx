import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  Button, StyleSheet, Alert, Modal, ScrollView
} from 'react-native'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'

interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
}

interface PedidoItem {
  producto: Producto
  cantidad: number
}

export default function NuevaVentaScreen() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [pedido, setPedido] = useState<PedidoItem[]>([])
  const [resultadoBusqueda, setResultadoBusqueda] = useState<Producto[]>([])
  const [tipoComprobante, setTipoComprobante] = useState<'boleta' | 'factura'>('boleta')
  const [cliente, setCliente] = useState({
    nombres: '',
    dni: '',
    direccion: '',
    ruc: '',
    razonSocial: ''
  })
  const [mostrarModal, setMostrarModal] = useState(false)

  const { user } = useAuth()
  const navigation = useNavigation()
  const filtrados = productos.filter(p =>
  (p.nombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
)

useEffect(() => {
  api.get('/productos')
    .then(res => {
      console.log('✅ Productos cargados:', res.data)
      setProductos(res.data)
    })
    .catch((err) => {
      console.error('❌ Error al obtener productos:', err.message)
    })
}, [])

  const agregarProducto = (producto: Producto) => {
    const existe = pedido.find(p => p.producto.id === producto.id)
    if (!existe) {
      setPedido([...pedido, { producto, cantidad: 1 }])
    }
  }

  const cambiarCantidad = (id: number, nuevaCantidad: number) => {
    setPedido(pedido.map(item =>
      item.producto.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ))
  }

  const eliminarProducto = (id: number) => {
    setPedido(pedido.filter(item => item.producto.id !== id))
  }

  const total = pedido.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)

  const confirmarVenta = async () => {
    if (!user) return Alert.alert('Error', 'Usuario no autenticado')
    if (pedido.length === 0) return Alert.alert('Aviso', 'Agrega productos al pedido')

    if (tipoComprobante === 'boleta' && (!cliente.nombres || !cliente.dni)) {
      return Alert.alert('Faltan datos', 'Completa los datos del cliente (boleta)')
    }

    if (tipoComprobante === 'factura' && (!cliente.ruc || !cliente.razonSocial)) {
      return Alert.alert('Faltan datos', 'Completa los datos del cliente (factura)')
    }

    const venta = {
      vendedorId: String(user.id),
      tipoComprobante,
      cliente,
      productos: pedido.map(item => ({
        id_producto: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        subtotal: item.cantidad * item.producto.precio
      })),
      estado: 'pendiente'
    }

    try {
      await api.post('/ventas', venta)
      Alert.alert('Éxito', 'Venta registrada correctamente')
      navigation.goBack()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'No se pudo registrar la venta')
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Nueva Venta</Text>

        <TextInput
        placeholder="Buscar producto..."
        style={styles.input}
        value={busqueda}
        onChangeText={setBusqueda}
        />

        <Button
          title="Buscar"
          onPress={() => {
            console.log('📝 Buscando:', busqueda)
            console.log('👀 Primer producto:', productos[0])

            const filtrados = productos.filter(p =>
              (p.nombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
            )

            console.log('Resultados:', filtrados)
            setResultadoBusqueda(filtrados)
          }}
        />

        <Text style={styles.subtitulo}>Resultados:</Text>

<FlatList
  data={resultadoBusqueda}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.resultadoItem}>
      <Text style={{ flex: 1 }}>{item.nombre} - S/ {item.precio.toFixed(2)}</Text>
      <Button title="Agregar" onPress={() => agregarProducto(item)} />
    </View>
  )}
  ListEmptyComponent={<Text style={{ textAlign: 'center', marginVertical: 10 }}>Sin resultados</Text>}
/>



      <Text style={styles.subtitulo}>Productos agregados</Text>
{pedido.map(({ producto, cantidad }) => (
  <View key={producto.id} style={styles.itemPedido}>
    <Text style={{ flex: 1 }}>{producto.nombre}</Text>
    <TextInput
      style={styles.input}
      keyboardType="number-pad"
      value={cantidad.toString()}
      onChangeText={(val) => cambiarCantidad(producto.id, parseInt(val) || 1)}
    />
    <Text style={{ width: 70, textAlign: 'right' }}>
      S/ {(producto.precio * cantidad).toFixed(2)}
    </Text>
    <TouchableOpacity onPress={() => eliminarProducto(producto.id)}>
      <Text style={styles.quitar}>Quitar</Text>
    </TouchableOpacity>
  </View>
))}


      <Text style={styles.total}>Total: S/ {total.toFixed(2)}</Text>

      <Button title="Confirmar venta" onPress={() => setMostrarModal(true)} />

      {/* Modal para datos del cliente */}
      <Modal visible={mostrarModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Datos del Cliente</Text>

            <View style={styles.switchRow}>
              <TouchableOpacity onPress={() => setTipoComprobante('boleta')}>
                <Text style={tipoComprobante === 'boleta' ? styles.opcionActiva : styles.opcion}>
                  Boleta
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTipoComprobante('factura')}>
                <Text style={tipoComprobante === 'factura' ? styles.opcionActiva : styles.opcion}>
                  Factura
                </Text>
              </TouchableOpacity>
            </View>

            {tipoComprobante === 'boleta' ? (
              <>
                <TextInput placeholder="Nombres" style={styles.input} value={cliente.nombres} onChangeText={val => setCliente({ ...cliente, nombres: val })} />
                <TextInput placeholder="DNI" style={styles.input} value={cliente.dni} onChangeText={val => setCliente({ ...cliente, dni: val })} />
                <TextInput placeholder="Dirección" style={styles.input} value={cliente.direccion} onChangeText={val => setCliente({ ...cliente, direccion: val })} />
              </>
            ) : (
              <>
                <TextInput placeholder="RUC" style={styles.input} value={cliente.ruc} onChangeText={val => setCliente({ ...cliente, ruc: val })} />
                <TextInput placeholder="Razón Social" style={styles.input} value={cliente.razonSocial} onChangeText={val => setCliente({ ...cliente, razonSocial: val })} />
                <TextInput placeholder="Dirección" style={styles.input} value={cliente.direccion} onChangeText={val => setCliente({ ...cliente, direccion: val })} />
              </>
            )}

            <View style={styles.modalBotones}>
              <Button title="Cancelar" onPress={() => setMostrarModal(false)} />
              <Button title="Registrar" onPress={confirmarVenta} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 },
  itemProducto: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  subtitulo: { marginTop: 20, fontWeight: 'bold' },
  itemPedido: { backgroundColor: '#f9f9f9', padding: 10, marginVertical: 5, borderRadius: 5 },
  cantidad: { borderWidth: 1, width: 60, marginVertical: 5, padding: 5, textAlign: 'center' },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  opcion: { padding: 10, borderRadius: 5, backgroundColor: '#eee' },
  opcionActiva: { padding: 10, borderRadius: 5, backgroundColor: '#007bff', color: '#fff' },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    resultadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  quitar: {
    color: 'red',
    marginLeft: 10,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
})
