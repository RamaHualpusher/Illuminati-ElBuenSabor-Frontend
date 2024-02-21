import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown, DropdownButton, Form, Button } from 'react-bootstrap';
import { IRankingUsuario } from "../../../interface/IUsuario";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";
import { IPedido } from "../../../interface/IPedido";
import { Link } from "react-router-dom";
import axios from "axios";
import { exportTableDataToExcel } from "../../../util/exportTableDataToExcel";
import { IProducto } from "../../../interface/IProducto";

const RankingClientes = () => {
  const [clientes, setClientes] = useState<IRankingUsuario[]>([]);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [data, setData] = useState<IRankingUsuario[]>([]);
  const [filteredData, setFilteredData] = useState<IRankingUsuario[]>([]);
  const [ordenCampo, setOrdenCampo] = useState<"cantidadPedidos" | "importeTotal">("cantidadPedidos");
  const [ordenTipo, setOrdenTipo] = useState<"ascendente" | "descendente">("ascendente");
  const [searchText, setSearchText] = useState<string>("");
  const API_URL = process.env.REACT_APP_API_URL || "";
  const API_URL_PEDIDOS = "assets/data/pedidos.json";
  const API_URL_CLIENTES = "assets/data/clienteTabla.json";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [clientesResponse, pedidosResponse] = await Promise.all([
  //         axios.get(API_URL_CLIENTES),
  //         axios.get(API_URL_PEDIDOS)
  //       ]);

  //       const clientesData = clientesResponse.data;
  //       const pedidosData = pedidosResponse.data;

  //       setClientes(clientesData);
  //       setPedidos(pedidosData);
  //       setData(clientesData);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [API_URL_CLIENTES, API_URL_PEDIDOS]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosResponse = await axios.get(`${API_URL}usuario/ranking`);
        const pedidosData = pedidosResponse.data;
        console.log(pedidosData)
        // Ordenar los pedidos por fecha de pedido de manera descendente
        pedidosData.sort((a: { fechaPedido: string | number | Date; }, b: { fechaPedido: string | number | Date; }) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());

        setPedidos(pedidosResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Aplicar filtrado y ordenación
    const dataOrdenada = [...data];

    if (ordenCampo === "cantidadPedidos") {
      dataOrdenada.sort((a, b) =>
        calculateCantidadPedidos(b.id) - calculateCantidadPedidos(a.id)
      );
    } else if (ordenCampo === "importeTotal") {
      dataOrdenada.sort((a, b) =>
        calculateImporteTotal(b.id) - calculateImporteTotal(a.id)
      );
    }

    // Si la orden es descendente, invertir el orden
    if (ordenTipo === "descendente") {
      dataOrdenada.reverse();
    }

    // Aplicar búsqueda
    const filteredData = customSearch(searchText, dataOrdenada, calculateCantidadPedidos, calculateImporteTotal);
    setFilteredData(filteredData);
  }, [ordenCampo, ordenTipo, searchText, data]);

  const columns: IColumn<IRankingUsuario>[] = [
    {
      title: "Fecha del Pedido",
      field: "telefono",
      width: 2,
      render: (rowData) => <div>{formatFechaPedido(rowData.id)}</div>
    },
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

  const formatFechaPedido = (usuarioId: number | undefined) => {
    const pedidosUsuario = pedidos.filter((pedido) => pedido.Usuario.id === usuarioId);
    if (pedidosUsuario.length > 0) {
      const fechaPedido = pedidosUsuario[0].fechaPedido;
      return new Intl.DateTimeFormat('es-AR').format(new Date(fechaPedido));
    }
    return "";
  };

  const calculateImporteTotal = (usuarioId: number | undefined) => {
    // Filtrar los pedidos correspondientes al usuario con el usuarioId proporcionado
    const pedidosUsuario = pedidos.filter((pedido) => pedido.Usuario.id === usuarioId);

    // Inicializar el total
    let total = 0;

    // Iterar sobre los pedidos del usuario
    if (pedidosUsuario) {
      pedidosUsuario.forEach((pedido) => {
        // Iterar sobre los detalles del pedido
        if (pedido && pedido.DetallePedido) {
          pedido.DetallePedido.forEach((detalle) => {
            // Verificar si detalle.Productos existe y es un array antes de iterar sobre él
            if (detalle && detalle.Productos && Array.isArray(detalle.Productos)) {
              detalle.Productos.forEach((producto: IProducto) => {
                total += producto.precio * detalle.cantidad;
              });
            }
          });
        }
      });
    }
    // Retornar el importe total
    return total;
  };


  const calculateCantidadPedidos = (usuarioId: number | undefined) => {
    return pedidos.filter((pedido) => pedido.Usuario.id === usuarioId).length;
  };

  const customSearch = (
    searchText: string,
    data: IRankingUsuario[],
    calculateCantidadPedidos: (usuarioId: number | undefined) => number,
    calculateImporteTotal: (usuarioId: number | undefined) => number
  ): IRankingUsuario[] => {
    return data.filter((usuario) =>
      usuario.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(searchText.toLowerCase()) ||
      calculateCantidadPedidos(usuario.id) > 0 || // Filtrar por cantidad de pedidos mayor a 0
      calculateImporteTotal(usuario.id) > 0 // Filtrar por importe total mayor a 0
    );
  };


  const handleChangeOrdenCampo = (nuevoOrdenCampo: "cantidadPedidos" | "importeTotal") => {
    setOrdenCampo(nuevoOrdenCampo);
  };

  const handleChangeOrdenTipo = (nuevoOrdenTipo: "ascendente" | "descendente") => {
    setOrdenTipo(nuevoOrdenTipo);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const exportToExcel = () => {
    // Ordenar pedidos por fecha descendente
    const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());

    if (pedidosOrdenados.length > 0) {
      // Mapear los pedidos a un formato adecuado para exportar
      const dataToExport = pedidosOrdenados.map((pedido) => ({
        FechaPedido: new Intl.DateTimeFormat('es-AR').format(new Date(pedido.fechaPedido)),
        Nombre: pedido.Usuario.nombre,
        Apellido: pedido.Usuario.apellido,
        CantidadPedidos: calculateCantidadPedidos(pedido.Usuario.id),
        ImporteTotal: calculateImporteTotal(pedido.Usuario.id),
      }));

      // Generar nombre de archivo
      const filename = `Lista completa Clientes`;

      // Llamar a la función para exportar a Excel
      exportTableDataToExcel(dataToExport, filename);
    }
  };


  return (
    <div>
      <Container fluid>
        <Row className="mt-3">
          <Col>
            <div className="mb-3 d-flex justify-content-between" style={{ width: "500px", margin: "10px" }}>
              <DropdownButton
                id="dropdown-ordenCampo"
                title={`Ordenar por ${ordenCampo}`}
                style={{ marginLeft: "110px" }}
              >
                <Dropdown.Item onClick={() => handleChangeOrdenCampo("cantidadPedidos")}>Cantidad de Pedidos</Dropdown.Item>
                <Dropdown.Item onClick={() => handleChangeOrdenCampo("importeTotal")}>Importe Total</Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                id="dropdown-ordenTipo"
                title={`Orden ${ordenTipo}`}
                style={{ marginLeft: "10px" }}
              >
                <Dropdown.Item onClick={() => handleChangeOrdenTipo("ascendente")}>Ascendente</Dropdown.Item>
                <Dropdown.Item onClick={() => handleChangeOrdenTipo("descendente")}>Descendente</Dropdown.Item>
              </DropdownButton>
            </div>
            <GenericTable<IRankingUsuario>
              columns={columns}
              data={filteredData}
              showDate={true}
              actions={{
                create: false,
                update: false,
                delete: false,
                view: false,
              }}
            />
            <Button variant="success" style={{ marginLeft: "10px" }} onClick={() => exportToExcel()}>
              Exportar a Excel
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RankingClientes;
