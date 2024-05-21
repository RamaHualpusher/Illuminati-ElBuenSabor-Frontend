import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";

const CustomDropdown = () => {
    const { user } = useAuth0();

    // Función para obtener las iniciales del usuario
    const getInitials = (name: any) => {
        return name.split(' ')
            .map((word: any[]) => word[0])
            .join('')
            .toUpperCase();
    };

    // Determinar si mostrar la imagen o las iniciales
    const renderContent = () => {
        if (user?.picture) {
            // Si hay una imagen disponible, mostrarla
            return (
                <img
                    src={user.picture}
                    alt={getInitials(user?.name || '')}
                    className="img-fluid rounded-circle me-2"
                    style={{
                        width: "50px",
                        height: "50px",
                    }}
                />
            );
        } else {
            // Si no hay imagen, mostrar las iniciales
            return (
                <div
                    className="img-fluid rounded-circle me-2 d-flex align-items-center justify-content-center"
                    style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#f0f0f0", // Color de fondo para las iniciales
                    }}
                >
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {getInitials(user?.name || '')}
                    </span>
                </div>
            );
        }
    };

    return (
        <Dropdown.Toggle
            variant="link"
            id="dropdown-user"
            as={Button}
            className="nav-link"
        >
            {renderContent()}
            {user?.name}
            {/* Aquí puedes mostrar el rol del usuario */}
            {user && user.rol && <span>{user.rol}</span>}
        </Dropdown.Toggle>
    );
};

export default CustomDropdown;
