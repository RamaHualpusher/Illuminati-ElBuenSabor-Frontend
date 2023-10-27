import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Usuario } from "../../../interface/Usuario";
import { Column } from "../../../interface/CamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";
import { Pedido } from "../../../interface/Pedido";
import { Link } from "react-router-dom";
import axios from "axios";

const RankingClientes = () => {
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [orden, setOrden] = useState<"cantidadPedidos" | "importeTotal">("cantidadPedidos"); // Estado para el orden

  const API_URL_PEDIDOS = "assets/data/pedidos.json";
  const API_URL_CLIENTES = "assets/data/clienteTabla.json";

  //Carga los datos de Clientes y Pedidos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesResponse, pedidosResponse] = await Promise.all([
          axios.get(API_URL_CLIENTES),
          axios.get(API_URL_PEDIDOS)
        ]);

        const clientesData = clientesResponse.data;
        const pedidosData = pedidosResponse.data;

        setClientes(clientesData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  // Define las columnas para la tabla 
  const columns: Column<Usuario>[] = [
    { title: "ID", field: "idUsuario", width: 2 },
    { title: "Nombre", field: "nombre", width: 2 },
    { title: "Apellido", field: "apellido", width: 2 },
    {
      title: "Cantidad de Pedidos", field: "telefono", width: 2,
      render: (rowData) =>
        <div>{calculateCantidadPedidos(rowData.idUsuario)}</div>
    },
    {
      title: "Importe Total", field: "telefono", width: 2,
      render: (rowData) =>
        <div>{calculateImporteTotal(rowData.idUsuario)}</div>
    },
    {
      title: "Pedidos", field: "telefono", width: 2,
      render: (rowData) => (
        <Link to={`/admin/ranking-pedidos/${rowData.idUsuario}`} className="btn btn-primary me-2">
          Ver <i className="bi bi-file-earmark-text-fill me-1"></i>
        </Link>
      ),
    },
  ];

  //Funcion para calcular el importe total
  const calculateImporteTotal = (usuarioId: number) => {
    return pedidos
      .filter((pedido) => pedido.Usuario.idUsuario === usuarioId)
      .reduce((total, pedido) => total + pedido.totalPedido, 0);
  };

  //Funcion para calcular la cantidad de pedidos por cada usuario
  const calculateCantidadPedidos = (usuarioId: number) => {
    return pedidos.filter((pedido) => pedido.Usuario.idUsuario === usuarioId).length;
  };

  // Función para cambiar el orden
  const handleChangeOrden = (nuevoOrden: "cantidadPedidos" | "importeTotal") => {
    setOrden(nuevoOrden);

    // Ordenar la lista de clientes según el nuevo criterio
    const clientesOrdenados = [...clientes];
    if (nuevoOrden === "cantidadPedidos") {
      clientesOrdenados.sort((a, b) =>
        calculateCantidadPedidos(b.idUsuario) - calculateCantidadPedidos(a.idUsuario)
      );
    } else if (nuevoOrden === "importeTotal") {
      clientesOrdenados.sort((a, b) =>
        calculateImporteTotal(b.idUsuario) - calculateImporteTotal(a.idUsuario)
      );
    }
    setClientes(clientesOrdenados);
  };

  // Función para búsqueda personalizada por id de usuario
  const customSearch = (searchText: string): Promise<Usuario[]> => {
    return new Promise((resolve) => {
      const filteredData = clientes?.filter((usuario) =>
        usuario.idUsuario.toString().includes(searchText)
      );
      resolve(filteredData);
    });
  };

  return (
    <div>
      <Container fluid>
        <Row className="mt-3">
          <Col>
            <div className="mb-3 d-flex justify-content-end">
              <DropdownButton id="dropdown-basic-button" title="Ordenar por">
                <Dropdown.Item onClick={() => handleChangeOrden("cantidadPedidos")}>
                  Cantidad de Pedidos
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleChangeOrden("importeTotal")}>
                  Importe Total
                </Dropdown.Item>
              </DropdownButton>
            </div>
            <GenericTable<Usuario>
              customSearch={customSearch}
              columns={columns}
              data={clientes}
              actions={{
                create: false,
                update: false,
                delete: false,
                view: false,
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RankingClientes;
