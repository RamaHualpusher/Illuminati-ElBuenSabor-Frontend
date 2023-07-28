import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { Container, Row, Col } from 'react-bootstrap';
import EditClienteModal from "./EditClienteModal";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";
import GenericTable from "../../GenericTable/GenericTable";
import { Action, Column } from '../../../interface/CamposTablaGenerica';

const Clientes = () => {
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [clientesComplete, setClientesComplete] = useState<Usuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Usuario | null>(null);
    const API_URL = "assets/data/clienteTabla.json";

    const columns: Column<Usuario>[] = [
        { title: 'ID Usuario', field: 'idUsuario' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Apellido', field: 'apellido' },
        { title: 'Email', field: 'email' },
        { title: 'Teléfono', field: 'telefono' },
        {
            title: 'Domicilio', field: 'Domicilio', render: (usuario: Usuario) =>
                <span>{`${usuario.Domicilio.calle},${usuario.Domicilio.numero},${usuario.Domicilio.localidad}`}</span>
        },
        {
            title: "Estado",
            field: "estado",
            render: (usuario: Usuario) => (
                <span className={`${usuario.estado ? "text-success" : "text-danger"}`}>
                    {usuario.estado ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
                </span>
            ),
        },
    ];

    // Función para busqueda personalizada por ID y nombre
    const customSearch = (searchText: string): Promise<Usuario[]> => {
        return new Promise((resolve) => {
            const normalizedSearchText = normalizeString(searchText);

            const filteredData = clientes.filter((cliente) => {
                const normalizedIdUsuario = normalizeString(cliente.idUsuario.toString());
                const normalizedNombre = normalizeString(cliente.nombre.toString());
                const normalizedApellido = normalizeString(cliente.apellido.toString());

                return (
                    normalizedIdUsuario.includes(normalizedSearchText) ||
                    normalizedNombre.includes(normalizedSearchText) ||
                    normalizedApellido.includes(normalizedSearchText)
                );
            });

            resolve(filteredData);
        });
    };

    //Normaliza el texto para que no importe las Mayus, Minus o Tildes
    const normalizeString = (str: string): string => {
        return str
            .toLowerCase()
            .normalize("NFD") // Eliminar tildes
            .replace(/[\u0300-\u036f]/g, "");
    };



    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setClientes(data);
                setClientesComplete(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const actions: Action = {
        update: true,
        delete: true
    };

    const handleClienteEdit = async (cliente: Usuario) => {
        const updatedCliente = await handleRequest(
            'PUT',
            `${API_URL}/${cliente.idUsuario}`,
            cliente
        );
        if (updatedCliente) {
            const newData = clientes.map((item) =>
                item.idUsuario === cliente.idUsuario ? updatedCliente : item
            );
            setClientes(newData);
        }
    };

    const handleClienteDelete = async (item: Usuario) => {
        const clienteId: number = item.idUsuario;

        try {
            await handleRequest('DELETE', `${API_URL}/${clienteId}`);
            setClientes(clientes.filter((item) => item.idUsuario !== clienteId));
        } catch (error) {
            console.log(error);
        }
    };

    const usuarioRow = (id: number) => {
        let i: number = 0;
        let x: boolean = true;
        while (x) {
            if (clientesComplete[i].idUsuario === id) {
                return clientesComplete[i];
                x = false;
            }
            i = i + 1;
        }
        return clientesComplete[0];
    }

    const handleEditModalOpen = (item: Usuario) => {
        setSelectedCliente(usuarioRow(item.idUsuario));
        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSelectedCliente(null);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <GenericTable<Usuario>
                            data={clientes}
                            columns={columns}
                            actions={actions}
                            onUpdate={handleEditModalOpen}
                            onDelete={handleClienteDelete}
                            customSearch={customSearch}
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

