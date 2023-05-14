import React, { useState, useEffect } from "react";
import { Empleado } from "../../../interface/interfaces";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import { Container, Row, Col, InputGroup, Button, FormControl } from 'react-bootstrap';

const Employee = () => {
    const [employees, setEmployees] = useState<Empleado[]>([]);
    const [employeesComplete, setEmployeesComplete] = useState<Empleado[]>([]);
    const [search, setSearch] = useState("");

    const columns = [
        { label: "IdEmpleado", width: 100 },
        { label: "Nombre", width: 200 },
        { label: "Apellido", width: 200 },
        { label: "Email", width: 200 },
    ];

    const data = employees
        ? employees.map((item) => [
            item.Id.toString(),
            item.Nombre.toString(),
            item.Apellido.toString(),
            item.Email.toString(),
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        filter(e.target.value);
    };

    const filter = (searchParam: string) => {
        var searchResult = employeesComplete.filter((employeeVal: Empleado) => {
            if (
                employeeVal.Id.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.Nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.Apellido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.Email.toString().toLowerCase().includes(searchParam.toLowerCase())
            )
                return employeeVal;
        });
        setEmployees(searchResult);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col sm={10}>
                        <h1>Buscar Empleado</h1>
                        <InputGroup className="mb-4">
                            <FormControl
                                placeholder="Buscar"
                                aria-label="Buscar"
                                aria-describedby="basic-addon2"
                                value={search}
                                onChange={handleChange}
                            />
                            <Button variant="outline-secondary" id="button-addon2">
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={true} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Employee;
