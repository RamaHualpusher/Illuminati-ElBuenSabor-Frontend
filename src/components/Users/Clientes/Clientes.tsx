import React, { useState, useEffect } from "react";
import { IUsuario } from "../../../interface/IUsuario";
import { Container, Row, Col } from 'react-bootstrap';
import EditClienteModal from "./EditClienteModal";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";
import GenericTable from "../../GenericTable/GenericTable";
import { IAction, IColumn } from '../../../interface/ICamposTablaGenerica';

const Clientes = () => {
    //Estados del componente
    const [clientes, setClientes] = useState<IUsuario[]>([]);
    const [clientesComplete, setClientesComplete] = useState<IUsuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<IUsuario | null>(null);
    const API_URL = "assets/data/clienteTabla.json";

    // Definición de las columnas de la tabla
    const columns: IColumn<IUsuario>[] = [
        { title: 'ID Usuario', field: 'id' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Apellido', field: 'apellido' },
        { title: 'Email', field: 'email' },
        { title: 'Teléfono', field: 'telefono' },
        {
            title: 'Domicilio', field: 'domicilio', render: (usuario: IUsuario) =>
                <span>{`${usuario.domicilio.calle},${usuario.domicilio.numero},${usuario.domicilio.localidad}`}</span>
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

    // Función para busqueda personalizada por ID y nombre
    const customSearch = (searchText: string): Promise<IUsuario[]> => {
        return new Promise((resolve) => {
            const normalizedSearchText = normalizeString(searchText);

            const filteredData = clientes.filter((cliente) => {
                const normalizedIdUsuario = cliente.id ? normalizeString(cliente.id.toString()) : '';
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

    //Llamada a la API para cargar los clientes
    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setClientes(data);
                setClientesComplete(data);
            })
            .catch((error) => console.log(error));
    }, []);

    //Define que acciones se pueden realizar
    const actions: IAction = {
        update: true,
        delete: true
    };

    //Editar un cliente 
    const handleClienteEdit = async (cliente: IUsuario) => {
        const updatedCliente = await handleRequest(
            'PUT',
            `${API_URL}/${cliente.id}`,
            cliente
        );
        if (updatedCliente) {
            const newData = clientes.map((item) =>
                item.id === cliente.id ? updatedCliente : item
            );
            setClientes(newData);
        }
    };

    //Eliminar un cliente
    const handleClienteDelete = async (item: IUsuario) => {
        const clienteId: number = item.id || 0;
        try {
            await handleRequest('DELETE', `${API_URL}/${clienteId}`);
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
            if (clientesComplete[i].id === id) {
                return clientesComplete[i];
                x = false;
            }
            i = i + 1;
        }
        return clientesComplete[0];
    }

    // Abrir modal de edición
    const handleEditModalOpen = (item: IUsuario) => {
        setSelectedCliente(usuarioRow(item.id));
        setEditModalShow(true);
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
                    <Col>
                        <GenericTable<IUsuario>
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

