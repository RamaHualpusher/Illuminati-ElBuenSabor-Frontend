import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { EditUsuarioFromAdmin } from "../../../interface/Usuario";
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";
import { Container, Row, Col } from 'react-bootstrap';
import EditEmpleadoModal from "./EditEmpleadoModal";
import AddEmpleadoModal from "./AddEmpleadoModal";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";

const Empleado = () => {
    const [empleados, setEmpleados] = useState<Usuario[]>([]);
    const [empleadosComplete, setEmpleadosComplete] = useState<Usuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<EditUsuarioFromAdmin | null>(null);

    const actions: Action = {
        create: true,
        update: true,
        delete: true
    };

    const columns: Column<Usuario>[] = [
        { title: 'ID Usuario', field: 'idUsuario' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Apellido', field: 'apellido' },
        { title: 'Email', field: 'email' },
        {
            title: 'Rol', field: 'Rol', render: (usuario: Usuario) =>
                <span>{`${usuario.Rol.nombreRol}`}</span>
        },
    ];
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


    const handleEmpleadoAdd = async (empleado: Usuario) => {
        const newEmpleado = await handleRequest('POST', API_URL, empleado);
        if (newEmpleado) {
            setEmpleados([...empleados, newEmpleado]);
            console.log("Empleado agregado");
            console.log(newEmpleado);

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

    const handleEmpleadoDelete = (item: Usuario) => {
        const usuarioId: number = item.idUsuario;

        try {
            handleRequest('DELETE', `${API_URL}/${usuarioId}`);
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


    const usuarioRow = (id: number) => {
        let i: number = 0;
        let x: boolean = true;
        while (x) {
            if (empleadosComplete[i].idUsuario === id) {
                let usuarioRe: EditUsuarioFromAdmin = empleadosComplete[i];
                return usuarioRe;
                x = false;
            }
            i = i + 1;
        }
        let usuarioRe: EditUsuarioFromAdmin = empleadosComplete[0];
        return usuarioRe;
    }

    const handleEditModalOpen = (item: Usuario) => {
        setSelectedUsuario(usuarioRow(item.idUsuario));
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
                    <Col>
                        <h1>Buscar Empleado</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm={12}>
                        {/* Wrap the GenericTable inside a responsive Table */}
                        {/* <Table responsive> */}
                        <GenericTable
                            data={empleados}
                            columns={columns}
                            actions={actions}
                            onAdd={handleAddModalOpen}
                            onUpdate={handleEditModalOpen}
                            onDelete={handleEmpleadoDelete}
                        />
                        {/* </Table> */}
                    </Col>
                </Row>
                <AddEmpleadoModal
                    show={addModalShow}
                    handleClose={handleAddModalClose}
                    handleEmpleadoAdd={handleEmpleadoAdd}
                />

                <EditEmpleadoModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleEmpleadoEdit={handleEmpleadoEdit}
                    selectedEmpleado={selectedUsuario}
                />
            </Container>
        </div>

    );
};

export default Empleado;
