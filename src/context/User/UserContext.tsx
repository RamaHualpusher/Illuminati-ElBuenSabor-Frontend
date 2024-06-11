// src/context/User/UserContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { IUsuario } from "../../interface/IUsuario";

interface UserContextProps {
  usuarioContext: IUsuario | null;
  setUsuarioContext: React.Dispatch<React.SetStateAction<IUsuario | null>>;
  actualizarUsuarioContext: () => Promise<void>;
  loading: boolean;
  userExists: boolean;
  cambiarContrasenia: boolean;
}

const UserContext = createContext<UserContextProps>({
  usuarioContext: null,
  setUsuarioContext: () => {},
  actualizarUsuarioContext: async () => {},
  loading: true,
  userExists: false,
  cambiarContrasenia: false,
});

export const UserProvider: React.FC = ({ children }) => {
  const { user: auth0User, isLoading, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [usuarioContext, setUsuarioContext] = useState<IUsuario | null>(null);
  const [cambiarContrasenia, setCambiarContrasenia] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const employeeToken = localStorage.getItem('employeeToken');

  const verificarEmpleado = useCallback(async (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const email = decodedToken.sub;

      const response = await axios.post(`${API_URL}usuario/empleados/email`, { email });

      setUsuarioContext(response.data);
      setUserExists(true);
      setLoading(false);

      // Verificar si necesita cambiar la Contrasenia
      if(response.data){
        if (response.data.rol.nombreRol != 'Admin' && response.data.rol.nombreRol != 'Cliente'  && response.data.primerIngreso) {
          setCambiarContrasenia(true);
        }else{
          setCambiarContrasenia(false);
        }
      }
    } catch (error) {
      console.error("Error al verificar el empleado:", error);
      setLoading(false);
    }
  }, [API_URL]);

  const actualizarUsuarioContext = useCallback(async () => {
    setLoading(true);
    if (employeeToken) {
      await verificarEmpleado(employeeToken);
    } else if (!isLoading && auth0User) {
      await verificarUsuarioExistente();
    }
    setLoading(false);
  }, [employeeToken, isLoading, auth0User, verificarEmpleado]);

  useEffect(() => {
    actualizarUsuarioContext();
  }, [actualizarUsuarioContext]);

  const verificarUsuarioExistente = async () => {
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
    <UserContext.Provider value={{ usuarioContext, setUsuarioContext, actualizarUsuarioContext, loading, userExists, cambiarContrasenia }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
