import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { EditUsuarioFromAdmin } from "../../../interface/Usuario";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Buscador from "../../Buscador/Buscador";
import EditEmpleadoModal from "./EditEmpleadoModal";
import AddEmpleadoModal from "./AddEmpleadoModal";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";

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


    const handleEmpleadoAdd = async (empleado: Usuario) => {
        const newEmpleado = await handleRequest('POST', API_URL, empleado);
        if (newEmpleado) {
            setEmpleados([...empleados, newEmpleado]);
        }
    };

    const handleEmpleadoEdit = async (empleado: EditUsuarioFromAdmin) => {
        const updatedEmpleado = await handleRequest(
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
        const usuarioId: number=+rowData[0];

        try {
            await handleRequest('DELETE', `${API_URL}/${usuarioId}`);
            setEmpleados(empleados.filter((item) => item.idUsuario !== usuarioId));
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


    const usuarioRow = (id:number)=>{
        let i:number=0;
        let x:boolean=true;
        while(x){
            if(empleadosComplete[i].idUsuario===id){
                let usuarioRe:EditUsuarioFromAdmin={
                    idUsuario:empleadosComplete[i].idUsuario,
                    nombre:empleadosComplete[i].nombre,
                    apellido:empleadosComplete[i].apellido,
                    email:empleadosComplete[i].email,
                    telefono:empleadosComplete[i].telefono,
                    Rol:empleadosComplete[i].Rol
                };
                return usuarioRe;
                x=false;
            }
            i=i+1;
        }
        let usuarioRe:EditUsuarioFromAdmin={
            idUsuario:empleadosComplete[0].idUsuario,
            nombre:empleadosComplete[0].nombre,
            apellido:empleadosComplete[0].apellido,
            email:empleadosComplete[0].email,
            telefono:empleadosComplete[0].telefono,
            Rol:empleadosComplete[0].Rol
        };
        return usuarioRe;
    }

    const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSelectedUsuario(usuarioRow(+rowData[0]));
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
                        <TablaGeneric columns={columns} data={data} showButton={true} buttonAdd={handleAddModalOpen}
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
