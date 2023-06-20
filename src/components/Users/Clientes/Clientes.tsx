import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import { Container, Row, Col, Button} from 'react-bootstrap';
import Buscador from "../../Buscador/Buscador";
import EditClienteModal from "./EditClienteModal";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";

const Clientes = () => {
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [clientesComplete, setClientesComplete] = useState<Usuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Usuario | null>(null);
    const [addModalShow, setAddModalShow] = useState(false);
    
    const columns = [
        { label: "idCliente", width: 100 },
        { label: "Nombre", width: 200 },
        { label: "Apellido", width: 200 },
        { label: "Email", width: 200 },
        { label: "Telefono", width: 200 },
        { label: "Rol", width: 150 },
        { label: "Domicilio", width: 200 },
    ];

    const data = clientes.map((item) => [
        item.idUsuario.toString(),
        item.nombre.toString(),
        item.apellido.toString(),
        item.email.toString(),
        item.telefono.toString(),
        item.Rol.nombreRol.toString(),
        `${item.Domicilio.calle}, ${item.Domicilio.numero}, ${item.Domicilio.localidad}`,
    ]);

    const API_URL = "assets/data/clienteTabla.json";

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setClientes(data);
                setClientesComplete(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const filter = (searchParam: string) => {
        const searchResult = clientesComplete.filter((clienteVal: Usuario) => {
            if (
                clienteVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.apellido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.email.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.telefono.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.Rol.nombreRol.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                `${clienteVal.Domicilio.calle}, ${clienteVal.Domicilio.numero}, ${clienteVal.Domicilio.localidad}`.toLowerCase().includes(searchParam.toLowerCase())
            ) {
                return clienteVal;
            }
            return null;
        });
        setClientes(searchResult);
    };

    const handleSearch = (searchParam: string) => {
        filter(searchParam);
    };

    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    const handleAddModalClose = () => {
        setAddModalShow(false);
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

    const handleClienteDelete = async (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const clienteId:number=+rowData[0];

        try {
            await handleRequest('DELETE', `${API_URL}/${clienteId}`);
            setClientes(clientes.filter((item) => item.idUsuario !== clienteId));
        } catch (error) {
            console.log(error);
        }
    };

    const usuarioRow = (id:number)=>{
        let i:number=0;
        let x:boolean=true;
        while(x){
            if(clientesComplete[i].idUsuario===id){
                return clientesComplete[i];
                x=false;
            }
            i=i+1;
        }
        return clientesComplete[0];
    }

    const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSelectedCliente(usuarioRow(+rowData[0]));
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
                    <Col sm={10}>
                        <h1>Buscar Cliente</h1>
                        <Buscador onSearch={handleSearch} />
                    </Col>
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-start">
                            <Button variant="primary" onClick={handleAddModalOpen}>
                                Agregar Cliente
                            </Button>
                        </Col>
                    </Row>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={true} buttonAdd={handleAddModalClose}
                            buttonEdit={handleEditModalOpen} buttonDelete={handleClienteDelete} />
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

