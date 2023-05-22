import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import { Container, Row, Col} from 'react-bootstrap';
import Buscador from "../../Buscador/Buscador";

const Employee = () => {
    const [employees, setEmployees] = useState<Usuario[]>([]);
    const [employeesComplete, setEmployeesComplete] = useState<Usuario[]>([]);

    const columns = [
        { label: "idUsuario", width: 100 },
        { label: "nombre", width: 200 },
        { label: "apellido", width: 200 },
        { label: "email", width: 200 },
    ];

    const data = employees
        ? employees.map((item) => [
            item.idUsuario.toString(),
            item.nombre.toString(),
            item.apellido.toString(),
            item.email.toString(),
        ])
        : [];

    useEffect(() => {
        fetch('assets/data/empleadoTabla.json')
            .then((response) => response.json())
            .then((data) => {
                setEmployees(data);
                setEmployeesComplete(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const filter = (searchParam: string) => {
        const searchResult = employeesComplete.filter((employeeVal: Usuario) => {
            if (
                employeeVal.idUsuario.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.apellido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.email.toString().toLowerCase().includes(searchParam.toLowerCase())
            ) {
                return employeeVal;
            }
            return null;
        });
        setEmployees(searchResult);
    };

    const defaultAct=(data:any)=>{};

    const handleSearch = (searchParam: string) => {
        filter(searchParam);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col sm={10}>
                        <h1>Buscar Empleado</h1>
                        <Buscador onSearch={handleSearch} />
                    </Col>
                </Row>
                <Row className="mt-3">              
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={false} buttonEdit={defaultAct} buttonDelete={defaultAct}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Employee;
