import React from "react";
import EmployeePage from "../components/EmployeePage/EmployeePage";
import EmployeePanel from "../components/EmployeePage/EmployeePanel";
import NavBar from "../components/NavBar/AdminBar";

const Admin = () => {
    return (
        <div>
            <NavBar/>            
            <EmployeePanel title={"Admin"}/>
            <EmployeePage />
        </div>
    );
};

export default Admin;