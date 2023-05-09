import React, { useState } from "react";

interface NavbarAdminProps {
  title: string;
}

const PanelAdmin: React.FC<NavbarAdminProps> = ({ title }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>
        
        <h1 className="Title_admin h1 text-white">{title}</h1>
      </div>
    </nav>
  );
};

export default PanelAdmin;
