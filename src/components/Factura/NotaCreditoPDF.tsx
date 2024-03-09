import { jsPDF } from "jspdf";
import { IProductoDto } from "../../interface/IProducto";
import { IPedidoDto } from "../../interface/IPedido";

const NotaCreditoPDF = ({ pedido }: { pedido: IPedidoDto }) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const margin = 10;

    pdf.addImage("/assets/img/logo-grupo-illuminati.jpg", "JPEG", margin, yPosition, 50, 50);
    yPosition += 60;

    pdf.setFontSize(12);
    pdf.text("El Buen Sabor", margin, yPosition);
    yPosition += 10;

    pdf.text(`Número de Nota de Crédito: ${pedido?.numeroPedido}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Fecha: ${new Date(pedido.fechaPedido).toLocaleString()}`, margin, yPosition);
    yPosition += 10;

    if (pedido?.detallesPedidos) {
      pedido.detallesPedidos.forEach((detalle) => {
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

    pdf.text(`Tipo de Pago: ${pedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Descuento:`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Envío: ${pedido?.esDelivery ? "Domicilio" : "Retiro local"}`, margin, yPosition);
    yPosition += 10;
    
    pdf.text(
      `Dirección: ${pedido?.usuario?.domicilio?.calle  || ""} ${pedido?.usuario?.domicilio?.numero || 0}, ${pedido?.usuario?.domicilio?.localidad || ""}`,
      margin,
      yPosition
    );

    yPosition += 40;
    pdf.text(`Muchas gracias ${pedido?.usuario?.nombre} ${pedido?.usuario?.apellido} por utilizar la Nota de Crédito`, margin, yPosition);
    yPosition += 10;
    pdf.text(`El Buen Sabor`, margin, yPosition);

    pdf.save(`Nota Credito de ${pedido?.usuario?.nombre} ${pedido?.usuario?.apellido}-Num. ${pedido?.numeroPedido}.pdf`);
  };

  // Llama a la función de generación cuando se renderiza el componente
  generatePDF();

  // Devuelve un componente vacío (puedes personalizar esto según tus necesidades)
  return null;
};

export default NotaCreditoPDF;

const getProductInfo = (producto: IProductoDto | undefined): string => {
  if (!producto) {
    return "";
  }

  return `${producto.nombre || "Nombre Desconocido"}`;
};

const getProductPrice = (producto: IProductoDto | undefined): number | undefined => {
  return producto?.precio || 0;
};
