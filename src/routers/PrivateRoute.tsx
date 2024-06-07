import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/User/UserContext";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { usuarioContext, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // O cualquier componente de loading que prefieras
  }

  if (!usuarioContext || !allowedRoles.includes(usuarioContext.rol.nombreRol)) {
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
