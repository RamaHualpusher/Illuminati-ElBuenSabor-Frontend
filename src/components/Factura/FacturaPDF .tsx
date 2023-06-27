import React from "react";
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Pedido } from '../../interface/Pedido';
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";

interface FacturaPDFProps {
  pedido?: Pedido;
  detallePedidos?: DetallePedido[];
  usuario?: Usuario;
}

const FacturaPDF: React.FC<FacturaPDFProps> = ({ pedido, detallePedidos, usuario }) => {
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 12,
      padding: 20,
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 5,
    },
    table: {
      width: 'auto',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCell: {
      padding: 5,
    },
    footer: {
      marginTop: 10,
      textAlign: 'right',
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>DETALLES DEL PEDIDO</Text>
          <Text>Número de Pedido: {pedido?.numeroPedido}</Text>
          <Text>Fecha: {pedido?.fechaPedido?.toString()}</Text>
          <Text>Forma de Pago: {pedido?.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Cantidad</Text>
            <Text style={styles.tableCell}>Detalle Producto</Text>
            <Text style={styles.tableCell}>Precio Unit.</Text>
          </View>
          {detallePedidos?.map((detalle) => (
            <View style={styles.tableRow} key={detalle?.idDetallePedido}>
              <Text style={styles.tableCell}>{detalle?.cantidad}</Text>
              <Text style={styles.tableCell}>{detalle?.Producto?.nombre}</Text>
              <Text style={styles.tableCell}>{detalle?.Producto?.precio}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text>Tipo de Pago: {pedido?.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</Text>
          {/* Agrega el código para el descuento */}
          <Text>Envío: {pedido?.esDelivery ? 'Envío domicilio' : 'Retiro local'}</Text>
          <Text>Total a pagar: {pedido?.totalPedido}</Text>
        </View>
        <View>
          <Text style={styles.title}>Envío</Text>
          <Text>
            Dirección: {usuario?.Domicilio?.calle} {usuario?.Domicilio?.numero}, {usuario?.Domicilio?.localidad}
          </Text>
        </View>
        <View>
          <Text>
            Muchas gracias {usuario?.nombre} {usuario?.apellido} por comprar en El Buen Sabor
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaPDF;
