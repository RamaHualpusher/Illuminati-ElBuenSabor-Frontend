import { jsPDF } from "jspdf";
import { IPedidoDto } from "../../interface/IPedido";
import { IDetallePedidoDto } from "../../interface/IDetallePedido";
import { IProductoDto } from "../../interface/IProducto";

const FacturaPDF = (selectedPedido: IPedidoDto) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const margin = 10;

    // Logo y nombre de la empresa
    pdf.addImage("/assets/img/logo-grupo-illuminati.jpg", "JPEG", margin, yPosition, 50, 50);
    yPosition += 60;
    pdf.setFontSize(12);
    pdf.text("El Buen Sabor", margin, yPosition);
    yPosition += 10;

    // Detalles del pedido
    pdf.text(`DETALLES DEL PEDIDO`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Número de Pedido: ${selectedPedido.numeroPedido}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Fecha: ${new Date(selectedPedido.fechaPedido).toLocaleString()}`, margin, yPosition);
    yPosition += 10;

    // Tabla de productos
    const tableHeaders = ["Cantidad", "Detalle Producto", "Precio Unit."];
    const tableData = selectedPedido.detallesPedidos.map((detalle: IDetallePedidoDto) => {
      const producto = detalle.producto as IProductoDto;
      return [detalle.cantidad || "", producto.nombre || "", producto.precio || ""];
    });
    const columnWidths = [30, 80, 40]; // Ancho de las columnas
    const rowHeight = 7; // Altura de las filas
    const cellMargin = 2; // Margen interno de las celdas
    tableData.unshift(tableHeaders); // Agregar encabezados
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        pdf.text(String(tableData[i][j]), margin + j * columnWidths[j] + cellMargin, yPosition + (i + 1) * rowHeight);

      }
    }
    yPosition += (tableData.length + 1) * rowHeight + 10;

    // Información de pago y envío
    const tipoPago = selectedPedido.esEfectivo ? "Efectivo" : "Mercado Pago";
    const descuento = selectedPedido.esEfectivo ? "10%" : "0%";
    const tipoEnvio = selectedPedido.esDelivery ? "Domicilio" : "Retiro local";
    pdf.text(`Tipo de Pago: ${tipoPago}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Descuento: ${descuento}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Envío: ${tipoEnvio}`, margin, yPosition);
    yPosition += 10;

    // Dirección de envío
    const direccion = selectedPedido.usuario?.domicilio ? 
      `${selectedPedido.usuario.domicilio.calle || ""} ${selectedPedido.usuario.domicilio.numero || ""}, ${selectedPedido.usuario.domicilio.localidad || ""}` :
      "";
    pdf.text(`Dirección: ${direccion}`, margin, yPosition);

    // Agradecimiento
    yPosition += 40;
    pdf.text(`Muchas gracias ${selectedPedido.usuario.nombre} ${selectedPedido.usuario.apellido} por comprar en`, margin, yPosition);
    yPosition += 10;
    pdf.text(`El Buen Sabor`, margin, yPosition);

    // Guardar el PDF
    pdf.save(`Factura de ${selectedPedido.usuario.nombre} ${selectedPedido.usuario.apellido}-Num. ${selectedPedido.numeroPedido}.pdf`);
  };

  return generatePDF();
};

export default FacturaPDF;
