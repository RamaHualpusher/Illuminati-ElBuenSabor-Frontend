import React, { useEffect } from "react";
import { send, init } from "emailjs-com";
import FacturaPDF from "../Factura/FacturaPDF";
import { IFactura } from "../../interface/IFactura";

interface SendEmailProps {
  factura: IFactura | null;
  onCancel: () => void;
}

const SendEmail: React.FC<SendEmailProps> = ({ factura }) => {
  const sendFacturaEmail = async () => {
    try {
      // Initialize EmailJS with your user ID
      init("tZx4R_Pz2pCXAxPVS");

      // Genera el PDF de la factura y obtiene el contenido como un buffer, el cual esta comentado
      //porque para ingresar un attachment en emailjs, hay que pagar
      // const facturaBuffer = FacturaPDF(factura);

      // Configura el servicio de email y envía el correo electrónico
      await send(
        "service_elBuenSabor", // Nombre del servicio de email
        "template_lkuvkds", // ID de la plantilla de email (si estás utilizando una)
        {
          to_email: factura?.pedido.usuario.email, // Dirección de correo electrónico del destinatario
          subject: `Factura a nombre de ${factura?.pedido.usuario.nombre.toUpperCase()} ${factura?.pedido.usuario.apellido.toUpperCase()}`, // Asunto del correo electrónico
          usuario_nombre: factura?.pedido.usuario.nombre, // Nombre del usuario
          usuario_apellido: factura?.pedido.usuario.apellido, // Apellido del usuario
          attachments: [{
            fileName: `Factura a nombre de ${factura?.pedido.usuario.nombre.toUpperCase()} ${factura?.pedido.usuario.apellido.toUpperCase()}.pdf`, // Nombre del archivo adjunto
            // content: facturaBuffer, // Contenido del archivo adjunto (el PDF de la factura)
            contentType: 'application/pdf', // Tipo de contenido del archivo adjunto
          }]
        }
      );
      console.log("Email enviado correctamente");
    } catch (error) {
      console.error("Error al enviar el email:", error);
    }
  };

  useEffect(() => {
    sendFacturaEmail();
  }, [factura]);

  return (
    <></>
  );
};

export default SendEmail;