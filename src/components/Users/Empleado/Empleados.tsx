import React, { useState, useEffect } from "react";
import { IEditUsuarioFromAdmin, IUsuario } from "../../../interface/IUsuario";
import { IAction, IColumn } from '../../../interface/ICamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";
import { Container, Row, Col, Form } from 'react-bootstrap';
import EditEmpleadoModal from "./EditEmpleadoModal";
import AddEmpleadoModal from "./AddEmpleadoModal";
import axios from 'axios';

const Empleados = () => {
    //Estados del componente
    const [empleados, setEmpleados] = useState<IUsuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<IEditUsuarioFromAdmin | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || "";
    const [filterOption, setFilterOption] = useState<string>("all");

    //Acciones que se pueden realizar
    const actions: IAction = {
        create: true,
        update: true,
        delete: true
    };

    const columns: IColumn<IUsuario>[] = [
        // Definir columnas de la tabla
        { title: 'ID Usuario', field: 'id' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Apellido', field: 'apellido' },
        { title: 'Email', field: 'email' },
        {
            title: 'Rol', field: 'rol', render: (usuario: IUsuario) =>
                <span>{`${usuario.rol ? usuario.rol.nombreRol : ''}`}</span>
        },
        {
            title: "Estado",
            field: "activo",
            render: (usuario: IUsuario) => (
                <span className={`${usuario.activo ? "text-success" : "text-danger"}`}>
                    {usuario.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
                </span>
            ),
        },

    ];

    // Cargar datos de empleados al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            let url = API_URL + "usuario/empleados";
            try {
                const response = await axios.get(url);
                setEmpleados(response.data);
            } catch (error) {
                console.error('Error al cargar datos de empleados:', error);
            }
        };

        fetchData();
    }, [filterOption]); // Agrega filterOption como dependencia aquí


    const handleEmpleadoAdd = async (empleado: IUsuario) => {
        try {
            const domicilio = {
                activo: empleado.domicilio.activo,
                calle: empleado.domicilio.calle,
                numero: empleado.domicilio.numero,
                localidad: empleado.domicilio.localidad,
            };

            const responseDomicilio = await axios.post(`${API_URL}domicilio`, domicilio);

            if (responseDomicilio.data) {
                const updatedEmpleado = {
                    ...empleado,
                    domicilio: { id: responseDomicilio.data.id, ...domicilio },
                };

                const responseEmpleado = await axios.post(`${API_URL}usuario`, updatedEmpleado);

                if (responseEmpleado.data) {
                    setEmpleados([...empleados, responseEmpleado.data]);
                    console.log('Empleado agregado:', responseEmpleado.data);
                } else {
                    console.log('No se pudo agregar el empleado');
                }
            } else {
                console.log('No se pudo agregar el domicilio');
            }
        } catch (error) {
            console.error('Error al agregar empleado:', error);
        }
    };

    // Manejar la edición de un empleado
    const handleEmpleadoEdit = async (empleado: IEditUsuarioFromAdmin) => {
        try {
            if (empleado.domicilio && empleado.domicilio.id) {
                const domicilio = {
                    id: empleado.domicilio.id,
                    activo: empleado.domicilio.activo,
                    calle: empleado.domicilio.calle,
                    numero: empleado.domicilio.numero,
                    localidad: empleado.domicilio.localidad,
                };

                const responseDomicilio = await axios.put(`${API_URL}domicilio/${empleado.domicilio.id}`, domicilio);

                if (responseDomicilio.data) {
                    const updatedEmpleado = {
                        ...empleado,
                        domicilio: { idPut: responseDomicilio.data.id, ...domicilio },
                    };

                    const responseEmpleado = await axios.put(`${API_URL}usuario/${empleado.id}`, updatedEmpleado);

                    if (responseEmpleado.data) {
                        const newData = empleados.map((item) =>
                            item.id === empleado.id ? responseEmpleado.data : item
                        );
                        setEmpleados(newData);
                        console.log('Empleado editado:', responseEmpleado.data);
                    } else {
                        console.log('No se pudo editar el empleado');
                    }
                } else {
                    console.log('No se pudo actualizar el domicilio');
                }
            } else {
                console.log('El empleado no tiene información de domicilio para actualizar');
            }
        } catch (error) {
            console.error('Error al editar empleado:', error);
        }
    };


    // Manejar la eliminación de un empleado
    const handleEmpleadoDelete = async (item: IUsuario) => {
        const usuarioId: number = item.id || 0;

        try {
            await axios.delete(`${API_URL + "usuario"}/${usuarioId}`);
            setEmpleados(empleados.filter((item) => item.id !== usuarioId));
            console.log("Empleado eliminado correctamente");
        } catch (error) {
            console.log("Error al eliminar empleado:", error);
        }
    };


    // Abrir modal para agregar empleado
    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    // Cerrar modal para agregar empleado
    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    // Obtener detalles de un usuario por su ID
    const usuarioRow = (id: number | undefined) => {
        let i: number = 0;
        let x: boolean = true;
        while (x) {
            if (empleados[i].id === id) {
                let usuarioRe: IEditUsuarioFromAdmin = empleados[i];
                return usuarioRe;
                x = false;
            }
            i = i + 1;
        }
        let usuarioRe: IEditUsuarioFromAdmin = empleados[0];
        return usuarioRe;
    }

    // Abrir modal para editar empleado
    const handleEditModalOpen = (item: IUsuario) => {
        const usuarioSeleccionado = usuarioRow(item.id);
        if (usuarioSeleccionado) {
            setSelectedUsuario(usuarioSeleccionado);
            setEditModalShow(true);
        } else {
            console.error("No se pudo encontrar el usuario seleccionado.");
        }
    };


    // Cerrar modal para editar empleado
    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSelectedUsuario(null);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col sm={3} className="mb-3">
                        <Form.Select
                            value={filterOption}
                            onChange={(e) => setFilterOption(e.target.value)}
                        >
                            <option value="all">Mostrar Todos</option>
                            <option value="active">Mostrar solo Activos</option>
                            <option value="inactive">Mostrar solo Inactivos</option>
                        </Form.Select>
                    </Col>
                    <Col sm={12}>
                        <GenericTable
                            data={empleados.filter(empleado => {
                                return (
                                    filterOption === "all" ||
                                    (filterOption === "active" && empleado.activo) ||
                                    (filterOption === "inactive" && !empleado.activo)
                                );
                            })}
                            columns={columns}
                            actions={actions}
                            onAdd={handleAddModalOpen}
                            onUpdate={handleEditModalOpen}
                            onDelete={handleEmpleadoDelete}
                        />
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

export default Empleados;
