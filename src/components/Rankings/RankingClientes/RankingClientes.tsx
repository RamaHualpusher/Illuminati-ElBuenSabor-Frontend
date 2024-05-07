import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import GenericTable from "../../GenericTable/GenericTable";
import axios from "axios";
import { exportTableDataToExcel } from "../../../util/exportTableDataToExcel";
import { IRankingUsuario } from "../../../interface/IUsuario";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import { Link } from "react-router-dom";
import { IPedidoDto } from "../../../interface/IPedido";
import PedidosID from "./PedidosID";

const RankingClientes = () => {
  const [clientes, setClientes] = useState<IRankingUsuario[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<IRankingUsuario[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [showPedidoModal, setShowPedidoModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<IRankingUsuario | null>(null); // Nuevo estado para almacenar el cliente seleccionado
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<IRankingUsuario[]>(`${API_URL}usuario/ranking`);
        console.log(response.data)
        setClientes(response.data);
        // Filtrar clientes sin pedidos
        // const filteredData = response.data.filter(cliente => cliente.pedidos.length > 0 && cliente.pedidos[0].id !== null);
        // setFilteredClientes(filteredData);
      } catch (error) {
        console.error(error);
      }
    };    

    fetchData();
  }, [API_URL]);

  const columns: IColumn<IRankingUsuario>[] = [
    {
      title: "Nombre Completo",
      field: "nombre",
      render: rowData => <span>{`${rowData.nombre} ${rowData.apellido}`}</span>
    },
    { title: "Email", field: "email" },
    { title: "Teléfono", field: "telefono" },
    { title: "Estado", field: "activo" },
    {
      title: "Fecha del Último Pedido",
      field: "pedidos",
      render: rowData => {
        const ultimaFechaPedido = obtenerUltimaFechaPedido(rowData.pedidos);
        return ultimaFechaPedido ? <span>{ultimaFechaPedido}</span> : <span>-</span>;
      }
    },
    {
      title: "Cantidad de Pedidos",
      field: "pedidos",
      render: rowData => <span>{rowData.pedidos.length}</span>
    },
    {
      title: "Ver Pedidos",
      field: "pedidos",
      render: (rowData) => (
        <span>
          {rowData.pedidos[0] && rowData.pedidos[0].id !== null ? (
            <Link to={`/admin/ranking-pedidos/${rowData.id}`} className="btn btn-primary me-2">
              Ver <i className="bi bi-file-earmark-text-fill me-1"></i>
            </Link>
          ) : (
            <span>Sin pedidos</span>
          )}
        </span>
      )
    }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const openPedidoModal = (cliente: IRankingUsuario) => {
    setSelectedCliente(cliente);
    setShowPedidoModal(true);
  };

  const handleClosePedidoModal = () => {
    setShowPedidoModal(false);
  };

  const exportToExcel = () => {
    if (clientes.length > 0) {
      const dataToExport = clientes.map(cliente => ({
        "Nombre Completo": `${cliente.nombre} ${cliente.apellido}`,
        Email: cliente.email,
        Teléfono: cliente.telefono,
        Rol: cliente.rol.nombreRol,
        Estado: cliente.activo ? "Activo" : "Inactivo",
        Domicilio: cliente.domicilio.calle,
        Localidad: cliente.domicilio.localidad,
      }));
      exportTableDataToExcel(dataToExport, "Clientes");
    }
  };

  const obtenerUltimaFechaPedido = (pedidos: { id: number, estadoPedido: string, fechaPedido: Date }[]) => {
    if (pedidos.length === 0) return null;
    return pedidos.reduce((maxFecha, pedido) => (pedido.fechaPedido > maxFecha ? pedido.fechaPedido : maxFecha), pedidos[0].fechaPedido);
  };

  return (
    <div>
      <Container fluid>
        <Row className="mt-3">
          <Col>
            <GenericTable
              columns={columns}
              data={clientes}
              actions={{
                create: false,
                update: false,
                delete: false,
                view: false,
              }}
            />
            <Button variant="success" style={{ marginLeft: "10px" }} onClick={exportToExcel}>
              Exportar a Excel
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RankingClientes;