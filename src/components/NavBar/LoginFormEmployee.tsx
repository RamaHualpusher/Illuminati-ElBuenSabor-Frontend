import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../../context/User/UserContext";
import { BiShow, BiHide } from "react-icons/bi";
import { IUsuario } from "../../interface/IUsuario";

interface LoginFormEmployeeProps {
  onLoginSuccess: () => void;
}

const LoginFormEmployee: React.FC<LoginFormEmployeeProps> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false); // Nueva variable de estado
  const API_URL = process.env.REACT_APP_API_URL || "";
  const { actualizarUsuarioContext } = useUser(); // Obtiene el contexto del usuario

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValid(null);
    setIsWaiting(false); // Reinicia la variable de estado

    try {
      // Obtener todos los usuarios
      const usersResponse = await axios.get<IUsuario[]>(
        API_URL + "usuario/empleados"
      );
      const users = usersResponse.data;

      // Buscar al usuario por email
      const user = users.find((usuario) => usuario.email === email);

      if (user && !user.activo) {
        // Si el usuario está bloqueado, mostrar un mensaje de error
        setError(
          "El usuario está bloqueado. Por favor, comuníquese con el Administrador."
        );
        return;
      }

      setValid(
        "¡Bienvenido " +
          user?.nombre +
          " " +
          user?.apellido +
          " a El Buen Sabor!"
      );
      setIsWaiting(true); // Establece la espera a verdadero

      // Espera 3 segundos antes de proceder con el login
      setTimeout(async () => {
        try {
          // Enviar el email y la contraseña encriptada al servidor
          const response = await axios.post(API_URL + "auth/loginEmployee", {
            email,
            password,
          });

          localStorage.setItem("employeeToken", response.data);
          // Actualiza el contexto del usuario
          await actualizarUsuarioContext();
          onLoginSuccess();
        } catch (err) {
          setError("Error de autenticación");
        }
      }, 3000); // 3 segundos de retraso
    } catch (err) {
      setError("Error de autenticación");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isWaiting} // Deshabilitar durante la espera
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword" className="mb-4">
        <Form.Label>Contraseña</Form.Label>
        <div className="input-group">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isWaiting} // Deshabilitar durante la espera
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isWaiting} // Deshabilitar durante la espera
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </Button>
        </div>
      </Form.Group>
      {error && (
        <div className="w-50 mx-auto">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      {valid && !error && (
        <div className="w-50 mx-auto">
          <Alert variant="success">{valid}</Alert>
        </div>
      )}
      {/* Mensaje de bienvenida */}
      <Button
        variant="primary"
        type="submit"
        className="btn btn-success mt-2"
        disabled={isWaiting}
      >
        Iniciar sesión
      </Button>
    </Form>
  );
};

export default LoginFormEmployee;
