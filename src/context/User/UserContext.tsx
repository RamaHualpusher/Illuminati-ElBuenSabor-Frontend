import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { IUsuario } from "../../interface/IUsuario";

interface UserContextProps {
  usuarioContext: IUsuario | null; // Asegúrate de que el tipo de usuario sea adecuado
  loading: boolean;
  userExists: boolean; // Nuevo estado para manejar la existencia del usuario
}

const UserContext = createContext<UserContextProps>({
  usuarioContext: null,
  loading: true,
  userExists: false,
});

export const UserProvider: React.FC = ({ children }) => {
  const { user: auth0User, isLoading, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false); // Nuevo estado para manejar la existencia del usuario
  const [usuarioContext, setUsuario] = useState<IUsuario | null>(null); // Estado para manejar la información del usuario
  const API_URL = process.env.REACT_APP_API_URL || "";
  
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
      // Aquí es donde verificarías si el usuario existe
      verificarUsuarioExistente();
    }
  }, [isLoading, auth0User]);
  
  const verificarUsuarioExistente = async () => {
    console.log("verificar Usuario");
    if (auth0User) {
      try {
        const response = await axios.post(
          `${API_URL}usuario/clientes/email`,
          {
            nombre: auth0User.given_name,
            apellido: auth0User.family_name,
            email: auth0User.email,
            // Otros campos que no son necesarios para la verificación
          }
        );
        console.log(
          "Respuesta al verificar usuario existente:",
          JSON.stringify(response.data)
        );
        // Si el usuario existe, actualizamos el estado del usuario con la información recibida
        setUsuario(response.data);
        setUserExists(true);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log("El usuario no existe, creándolo...");
          crearNuevoCliente();
        } else {
          console.error("Error al verificar el usuario:", error);
        }
      }
    }
  };
  // Función para crear un nuevo cliente en el servidor
  const crearNuevoCliente = async () => {
    try {
      if (usuarioContext && isAuthenticated) {
        const response = await axios.post(`${API_URL}usuario/clientes`, {
          nombre: usuarioContext.nombre,
          apellido: usuarioContext.apellido,
          email: usuarioContext.email,
          clave: null, // No tenemos la contraseña aquí
          telefono: "", // No tenemos el teléfono aquí
          idDomicilio: 0, // No tenemos el id de domicilio aquí
          calle: "", // No tenemos la calle aquí
          numero: NaN, // No tenemos el número aquí
          localidad: "", // No tenemos la localidad aquí
          idRol: 0, // No tenemos el id de rol aquí
          nombreRol: "", // No tenemos el nombre de rol aquí
        });
        console.log(
          "Respuesta al crear nuevo cliente:",
          JSON.stringify(response.data)
        );
        // Si se crea exitosamente el nuevo cliente, lo establecemos en el estado
        setUsuario(response.data);
      }
    } catch (error) {
      console.error("Error al crear el nuevo cliente:", error);
      // Aquí puedes manejar el error de forma adecuada, por ejemplo, mostrar un mensaje al usuario
    }
  };

  return (
    <UserContext.Provider value={{ usuarioContext, loading, userExists }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
