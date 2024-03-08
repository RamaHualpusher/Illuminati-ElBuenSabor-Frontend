import { jsPDF } from "jspdf";
import { IProductoDto } from "../../interface/IProducto";
import { IPedidoDto } from "../../interface/IPedido";

const FacturaPDF = (selectedPedido: IPedidoDto) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const margin = 10;

    pdf.addImage("/assets/img/logo-grupo-illuminati.jpg", "JPEG", margin, yPosition, 50, 50);
    yPosition += 60;

    pdf.setFontSize(12);
    pdf.text("El Buen Sabor", margin, yPosition);
    yPosition += 10;

    pdf.text(`Número de Pedido: ${selectedPedido?.numeroPedido}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Fecha: ${new Date(selectedPedido.fechaPedido).toLocaleString()}`, margin, yPosition);
    yPosition += 10;

    if (selectedPedido?.detallesPedidos) {
      selectedPedido.detallesPedidos.forEach((detalle) => {
        yPosition += 7;

        pdf.text(`Cantidad: ${detalle.cantidad || ""}`, margin, yPosition);
        yPosition += 7;

        if (detalle.producto) {
          const productInfo = getProductInfo(detalle.producto);
          pdf.text(`Producto: ${productInfo || "Nombre Desconocido"}`, margin, yPosition);
          yPosition += 7;          
        }

        pdf.text(`Precio Unit.: ${getProductPrice(detalle.producto) || "Precio Desconocido"}`, margin, yPosition);
        yPosition += 15;
      });
    }

    pdf.text(`Tipo de Pago: ${selectedPedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Descuento:`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Envío: ${selectedPedido?.esDelivery ? "Domicilio" : "Retiro local"}`, margin, yPosition);
    yPosition += 10;
    
    pdf.text(
      `Dirección: ${selectedPedido?.usuario?.domicilio?.calle  || ""} ${selectedPedido?.usuario?.domicilio?.numero || 0}, ${selectedPedido?.usuario?.domicilio?.localidad || ""}`,
      margin,
      yPosition
    );

    yPosition += 40;
    pdf.text(`Muchas gracias ${selectedPedido?.usuario?.nombre} ${selectedPedido?.usuario?.apellido} por comprar en`, margin, yPosition);
    yPosition += 10;
    pdf.text(`El Buen Sabor`, margin, yPosition);

    pdf.save(`Factura de ${selectedPedido?.usuario?.nombre} ${selectedPedido?.usuario?.apellido}-Num. ${selectedPedido?.numeroPedido}.pdf`);
  };

  return generatePDF();
};

export default FacturaPDF;

const getProductInfo = (producto: IProductoDto | undefined): string => {
  if (!producto) {
    return "";
  }

  return `${producto.nombre || "Nombre Desconocido"}`;
};

const getProductPrice = (producto: IProductoDto | undefined): number | undefined => {
  return producto?.precio || 0;
};
