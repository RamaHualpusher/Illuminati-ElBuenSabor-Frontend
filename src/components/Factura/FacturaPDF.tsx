import { jsPDF } from "jspdf";
import { IFactura } from "../../interface/IFactura";
import { IDetalleFactura } from "../../interface/IDetalleFactura";

const FacturaPDF = (selectedFactura: IFactura) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const margin = 10;

    // Logo y nombre de la empresa
    pdf.addImage("/assets/img/logo-grupo-illuminati.jpg", "JPEG", margin, yPosition, 30, 30);
    yPosition += 60;
    pdf.setFontSize(12);
    pdf.text("El Buen Sabor", margin, yPosition);
    yPosition += 10;

    // Detalles del pedido
    pdf.text(`DETALLES DEL PEDIDO`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Número de Factura: ${selectedFactura.id}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Fecha: ${new Date(selectedFactura.fechaFactura).toLocaleString()}`, margin, yPosition);
    yPosition += 10;

    // Tabla de productos
    const tableHeaders = ["Cantidad", "Detalle Producto", "Precio Unit."];
    const tableData = selectedFactura.detalleFactura.map((detalle: IDetalleFactura) => {
      return [detalle.cantidad || "", detalle.nombreProducto || "", detalle.precioProducto || ""];
    }) || [];
    const columnWidths = [30, 30, 40]; // Ancho de las columnas
    const rowHeight = 7; // Altura de las filas
    const cellMargin = 2; // Margen interno de las celdas

    // Dibujar la tabla
    for (let i = 0; i < tableData.length + 1; i++) {
      for (let j = 0; j < tableHeaders.length; j++) {
        const text = (i === 0) ? tableHeaders[j] : tableData[i - 1][j];
        pdf.text(String(text), margin + j * columnWidths[j] + cellMargin, yPosition + (i + 1) * rowHeight);
      }
    }
    yPosition += (tableData.length + 2) * rowHeight + 10;

    // Información de pago y envío
    const tipoPago = selectedFactura.esEfectivo ? "Efectivo" : "Mercado Pago";
    const descuento = selectedFactura.esEfectivo ? "10%" : "0%";
    // const tipoEnvio = selectedFactura?.esDelivery ? "Domicilio" : "Retiro local";
    pdf.text(`Tipo de Pago: ${tipoPago}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Descuento: ${descuento}`, margin, yPosition);
    yPosition += 7;
    // pdf.text(`Envío: ${tipoEnvio}`, margin, yPosition);
    yPosition += 10;

    // Dirección de envío
    const direccion = selectedFactura.pedido?.usuario?.domicilio ? 
      `${selectedFactura.usuario.domicilio.calle || ""} ${selectedFactura.usuario.domicilio.numero || ""}, ${selectedFactura.usuario.domicilio.localidad || ""}` :
      "";
    pdf.text(`Dirección: ${direccion}`, margin, yPosition);

    // Agradecimiento
    yPosition += 40;
    pdf.text(`Muchas gracias ${selectedFactura.usuario.nombre} ${selectedFactura.usuario.apellido} por comprar en`, margin, yPosition);
    yPosition += 10;
    pdf.text(`El Buen Sabor`, margin, yPosition);

    // Guardar el PDF
    const pdfFileName = `Factura de ${selectedFactura.usuario.nombre} ${selectedFactura.usuario.apellido}-Num. ${selectedFactura.id}.pdf`;
    pdf.save(pdfFileName);
    
    // Devolver el contenido del PDF como un Buffer (necesario para enviar por correo electrónico)
    return pdf.output('arraybuffer');  
  };

  return generatePDF();
};

export default FacturaPDF;
