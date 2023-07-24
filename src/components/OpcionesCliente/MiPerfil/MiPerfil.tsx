import React from 'react';
import { Card } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { EditUsuarioFromCliente } from '../../../interface/Usuario';

const MiPerfil: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated || !user) {
        // Si el usuario no está autenticado o los datos del usuario no están disponibles, puedes mostrar un mensaje de no autenticado o redirigir a la página de inicio de sesión.
        return <p>No estás autenticado. Por favor inicia sesión.</p>;
    }

    // Suponemos que "user" contiene los datos del usuario proporcionados por Auth0.
    const idUsuario = user.sub ? parseInt(user.sub) : 0;

    // Convertimos el número de la calle y número de la dirección a números.
    const numeroCalle = parseInt(user.user_metadata.calleNumero);

    const usuario: EditUsuarioFromCliente = {
        idUsuario: idUsuario, // Asignamos el valor ya convertido a número o 0 si no se pudo convertir.
        nombre: user.given_name || '', // Nombre del usuario
        apellido: user.family_name || '', // Apellido del usuario
        email: user.email || '', // Email del usuario
        clave: '', // Puedes asignar una clave si es necesario
        telefono: '', // Puedes asignar un teléfono si es necesario
        Domicilio: {
            calle: user.user_metadata.calle || '',
            localidad: user.user_metadata.localidad || '',
            numero: numeroCalle || 0,
            idDomicilio: 0
        },
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>Mi Perfil</Card.Title>
                <Card.Text>Nombre: {usuario.nombre}</Card.Text>
                <Card.Text>Apellido: {usuario.apellido}</Card.Text>
                <Card.Text>Email: {usuario.email}</Card.Text>
                {/* Puedes mostrar otros datos del usuario según la necesidad */}
                <Card.Text>Dirección: {usuario.Domicilio.calle} {usuario.Domicilio.numero}, {usuario.Domicilio.localidad}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default MiPerfil;
