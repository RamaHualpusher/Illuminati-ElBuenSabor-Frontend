import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { IUsuario } from "../../interface/IUsuario";

interface UserContextProps {
  usuarioContext: IUsuario | null;
  setUsuarioContext: React.Dispatch<React.SetStateAction<IUsuario | null>>;
  loading: boolean;
  userExists: boolean;
}

const UserContext = createContext<UserContextProps>({
  usuarioContext: null,
  setUsuarioContext: () => {},
  loading: true,
  userExists: false,
});

export const UserProvider: React.FC = ({ children }) => {
  const { user: auth0User, isLoading, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [usuarioContext, setUsuarioContext] = useState<IUsuario | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const employeeToken = localStorage.getItem('employeeToken');

  useEffect(() => {
    if (employeeToken) {
      verificarEmpleado(employeeToken);
    } else if (!isLoading) {
      verificarUsuarioExistente();
    }
  }, [isLoading, auth0User, employeeToken]);

  const verificarEmpleado = async (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const email = decodedToken.sub;
      console.log("Decoded Token Email: ", email); // Log para verificar email decodificado

      const response = await axios.post(`${API_URL}usuario/empleados/email`, { email });
      console.log("Response from Server: ", response.data); // Log para verificar la respuesta del servidor

      setUsuarioContext(response.data);
      setUserExists(true);
      setLoading(false);
    } catch (error) {
      console.error("Error al verificar el empleado:", error);
      setLoading(false);
    }
  };

  const verificarUsuarioExistente = async () => {
    setLoading(true);
    if (auth0User) {
      try {
        const response = await axios.post(`${API_URL}usuario/clientes/email`, {
          nombre: auth0User.given_name,
          apellido: auth0User.family_name,
          email: auth0User.email,
        });

        setUsuarioContext(response.data);
        setUserExists(true);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          crearNuevoCliente();
        } else {
          console.error("Error al verificar el usuario:", error);
        }
      }
      setLoading(false);
    }
  };

  const crearNuevoCliente = async () => {
    try {
      if (auth0User && isAuthenticated) {
        const response = await axios.post(`${API_URL}usuario/clientes`, {
          nombre: auth0User.given_name,
          apellido: auth0User.family_name,
          email: auth0User.email,
          clave: null,
          telefono: "",
          idDomicilio: 0,
          calle: "",
          numero: NaN,
          localidad: "",
          idRol: 0,
          nombreRol: "",
        });

        setUsuarioContext(response.data);
      }
    } catch (error) {
      console.error("Error al crear el nuevo cliente:", error);
    }
  };

  return (
    <UserContext.Provider value={{ usuarioContext, setUsuarioContext, loading, userExists }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
