import { useAuth0 } from "@auth0/auth0-react";
import React, { FC } from "react";
import { Link } from "react-router-dom";

const Profile: FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const defaultImage = process.env.PUBLIC_URL + "/logo512.png";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = defaultImage;
  };

  if (isLoading) {
    return <div className="text-center text-xl font-bold">Cargando...</div>;
  }

  return isAuthenticated ? (
    <>
      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            <img
              className="rounded-circle mb-2"
              src={user?.picture}
              alt={user?.name}
              onError={handleImageError}
              style={{ width: "150px", height: "150px" }}
            />
          </div>
          <h2 className="card-title text-center">{user?.name}</h2>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              <strong>Nombre</strong>
              <span>{user?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Email</strong>
              <span>{user?.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Nick</strong>
              <span>{user?.nickname}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          <Link to="/rubros/ingredientes" className="btn btn-secondary">
            Rubros Ingredientes
          </Link>
          <Link to="/rubros/productos" className="btn btn-secondary">
            Rubros Productos
          </Link>
        </div>
      </div>
    </>
  ) : (
    <div>
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          <Link to="/rubros/ingredientes" className="btn btn-secondary">
            Rubros Ingredientes
          </Link>
          <Link to="/rubros/productos" className="btn btn-secondary">
            Rubros Productos
          </Link>
        </div>
      </div>
      <div className="text-center text-xl font-bold">
        Presione Iniciar sesión para ver la información de su perfil.
      </div>
    </div>
  );
};

export default Profile;
