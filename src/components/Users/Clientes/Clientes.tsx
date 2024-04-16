import React, { useState, useEffect } from "react";
import { IEditUsuarioFromCliente, IUsuario } from "../../../interface/IUsuario";
import { Container, Row, Col, Form } from 'react-bootstrap';
import EditClienteModal from "./EditClienteModal";
import GenericTable from "../../GenericTable/GenericTable";
import { IAction, IColumn } from '../../../interface/ICamposTablaGenerica';
import axios from 'axios';

const Clientes = () => {
    //Estados del componente
    const [clientes, setClientes] = useState<IUsuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<IEditUsuarioFromCliente | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || "";
    const [filterOption, setFilterOption] = useState<string>("all"); // Puedes inicializarlo con "all"

    //Define que acciones se pueden realizar
    const actions: IAction = {
        update: true,
        delete: true
    };

    // Definición de las columnas de la tabla
    const columns: IColumn<IUsuario>[] = [
        { title: 'ID Cliente', field: 'id' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Apellido', field: 'apellido' },
        { title: 'Email', field: 'email' },
        { title: 'Teléfono', field: 'telefono' },
        {
            title: 'Domicilio',
            field: 'domicilio',
            render: (usuario: IUsuario) => (
                <span>{`${usuario.domicilio ? usuario.domicilio.calle : ""} ${usuario.domicilio ? usuario.domicilio?.numero : 0}, ${usuario.domicilio ? usuario.domicilio?.localidad : ""}`}</span>
            )
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

    useEffect(() => {
        const fetchData = async () => {
            let url = API_URL + "usuario/clientes";

            try {
                const response = await axios.get(url);
                setClientes(response.data);
                // setClientesComplete(response.data);
            } catch (error) {
                console.error('Error al cargar datos de clientes:', error);
            }
        };

        fetchData();
    }, [filterOption]);


    //Editar un cliente 
    const handleClienteEdit = async (cliente: IEditUsuarioFromCliente) => {
        try {
            // Verificar si el cliente tiene información de domicilio
            if (cliente.domicilio && cliente.domicilio.id) {
                // Si el cliente tiene un ID de domicilio existente, actualizar el domicilio
                const domicilio = {
                    id: cliente.domicilio.id,
                    activo: cliente.domicilio.activo,
                    calle: cliente.domicilio.calle,
                    numero: cliente.domicilio.numero,
                    localidad: cliente.domicilio.localidad,
                };

                const responseDomicilio = await axios.put(`${API_URL}domicilio/${cliente.domicilio.id}`, domicilio);

                if (responseDomicilio.data) {
                    const updatedCliente = {
                        ...cliente,
                        domicilio: { idPut: responseDomicilio.data.id, ...domicilio },
                    };

                    const responseCliente = await axios.put(`${API_URL}usuario/${cliente.id}`, updatedCliente);

                    if (responseCliente.data) {
                        const newData = clientes.map((item) =>
                            item.id === cliente.id ? responseCliente.data : item
                        );
                        setClientes(newData);
                        console.log('Cliente editado:', responseCliente.data);
                    } else {
                        console.log('No se pudo editar el cliente');
                    }
                } else {
                    console.log('No se pudo actualizar el domicilio');
                }
            } else {
                console.log('El cliente no tiene información de domicilio para actualizar');
            }
        } catch (error) {
            console.error('Error al editar cliente:', error);
        }
    };


    //Eliminar un cliente
    const handleClienteDelete = async (item: IUsuario) => {
        const clienteId: number = item.id || 0;
        try {
            await axios.delete(`${API_URL}usuario/${clienteId}`);
            setClientes(clientes.filter((item) => item.id !== clienteId));
        } catch (error) {
            console.log(error);
        }
    };

    // Función para obtener un cliente por su ID
    const usuarioRow = (id: number | undefined) => {
        let i: number = 0;
        let x: boolean = true;
        while (x) {
            if (clientes[i].id === id) {
                let usuarioRe: IEditUsuarioFromCliente = clientes[i];
                return usuarioRe;
                x = false;
            }
            i = i + 1;
        }
        let usuarioRe: IEditUsuarioFromCliente = clientes[0];
        return usuarioRe;
    }

    // Abrir modal de edición
    const handleEditModalOpen = (item: IUsuario) => {
        const usuarioSeleccionado = usuarioRow(item.id);
        if (usuarioSeleccionado) {
            setSelectedCliente(usuarioSeleccionado);
            setEditModalShow(true);
        } else {
            console.error("No se pudo encontrar el cliente seleccionado.");
        }
    };

    // Cerrar modal de edición
    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSelectedCliente(null);
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
                            data={clientes.filter(cliente => {
                                return (
                                    filterOption === "all" ||
                                    (filterOption === "active" && cliente.activo) ||
                                    (filterOption === "inactive" && !cliente.activo)
                                );
                            })}
                            columns={columns}
                            actions={actions}
                            onUpdate={handleEditModalOpen}
                            onDelete={handleClienteDelete}
                        />
                    </Col>
                </Row>
                <EditClienteModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleClienteEdit={handleClienteEdit}
                    selectedCliente={selectedCliente} />
            </Container>
        </div>
    );
};

export default Clientes;

