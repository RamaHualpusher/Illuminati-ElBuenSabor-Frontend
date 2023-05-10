import React from "react";
import EmployeePage from "../../EmployeePage/EmployeePage";
import EmployeePanel from "../../EmployeePage/EmployeePanel";
import NavBar from "../../NavBar/AdminBar";

const Employee = () => {
    return (
        <div>
            <NavBar/>            
            <EmployeePanel title={"Empleados"}/>
            <EmployeePage />
        </div>
    );
};

export default Employee;