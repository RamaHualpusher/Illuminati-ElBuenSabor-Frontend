import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown, DropdownButton,Form } from 'react-bootstrap';
import { IUsuario } from "../../../interface/IUsuario";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";
import { IPedido } from "../../../interface/IPedido";
import { Link } from "react-router-dom";
import axios from "axios";

const RankingClientes = () => {
  const [clientes, setClientes] = useState<IUsuario[]>([]);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [orden, setOrden] = useState<"cantidadPedidos" | "importeTotal">("cantidadPedidos"); // Estado para el orden
  const [searchText, setSearchText] = useState<string>("");

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
  const columns: IColumn<IUsuario>[] = [
    { title: "ID", field: "id",
     width: 2 },
    { title: "Nombre", field: "nombre", width: 2 },
    { title: "Apellido", field: "apellido", width: 2 },
    {
      title: "Cantidad de Pedidos", field: "telefono", width: 2,
      render: (rowData) =>
        <div>{calculateCantidadPedidos(rowData.id)}</div>
    },
    {
      title: "Importe Total", field: "telefono", width: 2,
      render: (rowData) =>
        <div>{calculateImporteTotal(rowData.id)}</div>
    },
    {
      title: "Pedidos", field: "telefono", width: 2,
      render: (rowData) => (
        <Link to={`/admin/ranking-pedidos/${rowData.id}`} className="btn btn-primary me-2">
          Ver <i className="bi bi-file-earmark-text-fill me-1"></i>
        </Link>
      ),
    },
  ];

  //Funcion para calcular el importe total
  const calculateImporteTotal = (usuarioId: number | undefined) => {
    return pedidos
      .filter((pedido) => pedido.Usuario.id === usuarioId)
      .reduce((total, pedido) => total + pedido.totalPedido, 0);
  };

  //Funcion para calcular la cantidad de pedidos por cada usuario
  const calculateCantidadPedidos = (usuarioId: number | undefined) => {
    return pedidos.filter((pedido) => pedido.Usuario.id === usuarioId).length;
  };

  // Función para cambiar el orden
  const handleChangeOrden = (nuevoOrden: "cantidadPedidos" | "importeTotal") => {
    setOrden(nuevoOrden);

    // Ordenar la lista de clientes según el nuevo criterio
    const clientesOrdenados = [...clientes];
    if (nuevoOrden === "cantidadPedidos") {
      clientesOrdenados.sort((a, b) =>
        calculateCantidadPedidos(b.id) - calculateCantidadPedidos(a.id)
      );
    } else if (nuevoOrden === "importeTotal") {
      clientesOrdenados.sort((a, b) =>
        calculateImporteTotal(b.id) - calculateImporteTotal(a.id)
      );
    }
    setClientes(clientesOrdenados);
  };

  // Función para búsqueda personalizada por id de usuario
  const customSearch = (searchText: string): Promise<IUsuario[]> => {
    return new Promise((resolve) => {
      const filteredData = clientes?.filter((usuario) =>
        usuario.nombre?.toLowerCase().toString().includes(searchText) ||
        usuario.apellido?.toLowerCase().toString().includes(searchText)
      );
      resolve(filteredData);
    });
  };

   // Función para manejar cambios en el campo de búsqueda
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <Container fluid>
      <Row className="mt-3">
          <Col>
            <div className="mb-3 d-flex justify-content" style={{ width: "250px", margin: "10px" }}>
              <Form.Select
                className="me-2"
                value={orden}
                onChange={(e: any) => handleChangeOrden(e.target.value as "cantidadPedidos" | "importeTotal")}
              >
                <option value="cantidadPedidos">Cantidad de Pedidos</option>
                <option value="importeTotal">Importe Total</option>
              </Form.Select>             
            </div>
            <GenericTable<IUsuario>
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
