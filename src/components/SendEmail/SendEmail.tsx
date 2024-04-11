import React, { useEffect } from "react";
import emailjs from "emailjs-com";
import FacturaPDF from "../Factura/FacturaPDF";
import { IFactura } from "../../interface/IFactura";

interface SendEmailProps {
 factura: IFactura;
}

const SendEmail: React.FC<SendEmailProps> = ({ factura }) => {
    useEffect(() => {
      const sendEmail = async () => {
        try {
          // Genera el PDF de la factura y obtiene el contenido como un buffer
          const facturaBuffer = FacturaPDF(factura);
  
          // Configura el servicio de email y envía el correo electrónico
          await emailjs.send(
            "Gmail_API", // Nombre del servicio de email
            "template_id", // ID de la plantilla de email (si estás utilizando una)
            {
              to_email: factura.usuario.email, // Dirección de correo electrónico del destinatario
              subject: `Factura a nombre de -${factura.usuario.nombre}-${factura.usuario.apellido}.pdf`, // Asunto del correo electrónico
              message: `Gracias por utilizar nuestros servicios, te enviamos la factura del pedido.`, // Cuerpo del correo electrónico
              attachments: [{
                fileName: `Factura a nombre de -${factura.usuario.nombre}-${factura.usuario.apellido}.pdf`, // Nombre del archivo adjunto
                content: facturaBuffer, // Contenido del archivo adjunto (el PDF de la factura)
                contentType: 'application/pdf', // Tipo de contenido del archivo adjunto
              }]
            },
            "user_id" // ID de usuario (si estás autenticando el servicio de email)
          );
          console.log("Email enviado correctamente");
        } catch (error) {
          console.error("Error al enviar el email:", error);
        }
      };
  
      // Llama a la función para enviar el email cuando se monta el componente
      sendEmail();
    }, [factura]);
  
    return <></>; // Este componente no renderiza nada visible en la interfaz
  };
  
  export default SendEmail;
  