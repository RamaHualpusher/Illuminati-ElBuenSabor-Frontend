import { jsPDF } from "jspdf";
import { IProducto } from "../../interface/IProducto";
import { IPedido } from "../../interface/IPedido";

const FacturaPDF = ({ pedido }: { pedido: IPedido }) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const margin = 10;

    pdf.addImage("/assets/img/logo-grupo-illuminati.jpg", "JPEG", margin, yPosition, 50, 50);
    yPosition += 60;

    pdf.setFontSize(12);
    pdf.text("El Buen Sabor", margin, yPosition);
    yPosition += 10;

    pdf.text(`Número de Pedido: ${pedido?.numeroPedido}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Fecha: ${new Date(pedido.fechaPedido).toLocaleString()}`, margin, yPosition);
    yPosition += 10;

    if (pedido?.DetallePedido) {
      pedido.DetallePedido.forEach((detalle) => {
        yPosition += 7;

        pdf.text(`Cantidad: ${detalle.cantidad || ""}`, margin, yPosition);
        yPosition += 7;

        if (detalle.Productos) {
          const productInfo = getProductInfo(detalle.Productos);
          pdf.text(`Producto: ${productInfo || "Nombre Desconocido"}`, margin, yPosition);
          yPosition += 7;          
        }

        pdf.text(`Precio Unit.: ${getProductPrice(detalle.Productos) || "Precio Desconocido"}`, margin, yPosition);
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
      `Dirección: ${pedido?.Usuario?.domicilio?.calle  || ""} ${pedido?.Usuario?.domicilio?.numero || 0}, ${pedido?.Usuario?.domicilio?.localidad || ""}`,
      margin,
      yPosition
    );

    yPosition += 40;
    pdf.text(`Muchas gracias ${pedido?.Usuario?.nombre} ${pedido?.Usuario?.apellido} por comprar en`, margin, yPosition);
    yPosition += 10;
    pdf.text(`El Buen Sabor`, margin, yPosition);

    pdf.save(`Factura de ${pedido?.Usuario?.nombre} ${pedido?.Usuario?.apellido}-Num. ${pedido?.numeroPedido}.pdf`);
  };

  return generatePDF();
};

export default FacturaPDF;

const getProductInfo = (producto: IProducto | undefined): string => {
  if (!producto) {
    return "";
  }

  return `${producto.nombre || "Nombre Desconocido"}`;
};

const getProductPrice = (producto: IProducto | undefined): number | undefined => {
  return producto?.precio || 0;
};
