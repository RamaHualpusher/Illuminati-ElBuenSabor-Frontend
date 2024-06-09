import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../../context/User/UserContext';

interface LoginFormEmployeeProps {
  onLoginSuccess: () => void;
}

const LoginFormEmployee: React.FC<LoginFormEmployeeProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const { actualizarUsuarioContext } = useUser(); // Obtiene el contexto del usuario

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(API_URL + 'auth/loginEmployee', { email, password });
      console.log("Login Response: ", response.data); // Log para verificar la respuesta del login

      localStorage.setItem('employeeToken', response.data);
      // Actualiza el contexto del usuario
      await actualizarUsuarioContext();
      onLoginSuccess();
    } catch (err) {
      setError('Error de autenticación');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="btn btn-success mt-2">
        Iniciar sesión
      </Button>
    </Form>
  );
};

export default LoginFormEmployee;
