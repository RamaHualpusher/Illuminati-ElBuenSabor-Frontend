import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { EditUsuarioFromAdmin } from "../../../interface/Usuario";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Buscador from "../../Buscador/Buscador";
import EditEmpleadoModal from "./EditEmpleadoModal";
import AddEmpleadoModal from "./AddEmpleadoModal";

const Empleado = () => {
    const [empleados, setEmpleados] = useState<Usuario[]>([]);
    const [empleadosComplete, setEmpleadosComplete] = useState<Usuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<EditUsuarioFromAdmin | null>(null);

    const columns = [
        { label: "idUsuario", width: 100 },
        { label: "Nombre", width: 200 },
        { label: "Apellido", width: 200 },
        { label: "Email", width: 200 },
        { label: "Rol", width: 150 },
    ];

    const data = empleados.map((item) => [
        item.idUsuario.toString(),
        item.nombre.toString(),
        item.apellido.toString(),
        item.email.toString(),
        item.Rol.nombreRol.toString(),
    ]);

    const API_URL = "assets/data/empleadoTabla.json";

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setEmpleados(data);
                setEmpleadosComplete(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const filter = (searchParam: string) => {
        const searchResult = empleadosComplete.filter((employeeVal: Usuario) => {
            if (
                employeeVal.idUsuario.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.apellido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.email.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                employeeVal.Rol.nombreRol.toString().toLowerCase().includes(searchParam.toLowerCase())
            ) {
                return employeeVal;
            }
            return null;
        });
        setEmpleados(searchResult);
    };

    const handleSearch = (searchParam: string) => {
        filter(searchParam);
    };

    const handleEmpleadoRequest = async (method: string, endpoint: string, body?: object) => {
        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Error al realizar la solicitud');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEmpleadoAdd = async (empleado: Usuario) => {
        const newEmpleado = await handleEmpleadoRequest('POST', API_URL, empleado);
        if (newEmpleado) {
            setEmpleados([...empleados, newEmpleado]);
        }
    };

    const handleEmpleadoEdit = async (empleado: EditUsuarioFromAdmin) => {
        const updatedEmpleado = await handleEmpleadoRequest(
            'PUT',
            `${API_URL}/${empleado.idUsuario}`,
            empleado
        );
        if (updatedEmpleado) {
            const newData = empleados.map((item) =>
                item.idUsuario === empleado.idUsuario ? updatedEmpleado : item
            );
            setEmpleados(newData);
        }
    };

    const handleEmpleadoDelete = async (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const usuario: EditUsuarioFromAdmin = {
            idUsuario: +rowData[0],
            nombre: rowData[1],
            apellido: rowData[2],
            email: rowData[3],
            telefono: rowData[4],
            Rol: { idRol: parseInt(rowData[5]), nombreRol: '' },
        };

        try {
            await handleEmpleadoRequest('DELETE', `${API_URL}/${usuario.idUsuario}`);
            setEmpleados(empleados.filter((item) => item.idUsuario !== usuario.idUsuario));
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const selectedEmpleado: EditUsuarioFromAdmin = {
            idUsuario: +rowData[0],
            nombre: rowData[1],
            apellido: rowData[2],
            email: rowData[3],
            telefono: rowData[4],
            Rol: { idRol: parseInt(rowData[5]), nombreRol: '' },
        };
        setSelectedUsuario(selectedEmpleado);
        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSelectedUsuario(null);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col sm={10}>
                        <h1>Buscar Empleado</h1>
                        <Buscador onSearch={handleSearch} />
                    </Col>
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-start">
                            <Button variant="primary" onClick={handleAddModalOpen}>
                                Agregar Empleado
                            </Button>
                        </Col>
                    </Row>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={true}
                            buttonEdit={handleEditModalOpen} buttonDelete={handleEmpleadoDelete} />
                    </Col>
                </Row>
                <AddEmpleadoModal
                    show={addModalShow}
                    handleClose={handleAddModalClose}
                    handleEmpleadoAdd={handleEmpleadoAdd} />

                <EditEmpleadoModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleEmpleadoEdit={handleEmpleadoEdit}
                    selectedEmpleado={selectedUsuario} />
            </Container>
        </div>
    );
};

export default Empleado;
