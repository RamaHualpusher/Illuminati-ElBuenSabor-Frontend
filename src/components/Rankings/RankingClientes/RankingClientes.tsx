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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesResponse, pedidosResponse] = await Promise.all([
          axios.get<IRankingUsuario[]>(`${API_URL_CLIENTES}`),
          axios.get<IPedido[]>(`${API_URL_PEDIDOS}`)
        ]);

        setClientes(clientesResponse.data);
        setPedidos(pedidosResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [API_URL]);

  useEffect(() => {
    // Aplicar filtrado y ordenación
    const dataOrdenada = [...clientes];

    if (ordenCampo === "cantidadPedidos") {
      dataOrdenada.sort((a, b) => calculateCantidadPedidos(b.id) - calculateCantidadPedidos(a.id));
    } else if (ordenCampo === "importeTotal") {
      dataOrdenada.sort((a, b) => calculateImporteTotal(b.id) - calculateImporteTotal(a.id));
    }

    if (ordenTipo === "descendente") {
      dataOrdenada.reverse();
    }

    const filteredData = customSearch(searchText, dataOrdenada, calculateCantidadPedidos, calculateImporteTotal);
    setFilteredData(filteredData);
  }, [ordenCampo, ordenTipo, searchText, clientes]);


  const columns: IColumn<IRankingUsuario>[] = [
    {
      title: "Fecha del Pedido",
      field: "fechaPedido",
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
    const pedidosUsuario = pedidos.filter((pedido) => pedido.Usuario.id === usuarioId);
    let total = 0;
    pedidosUsuario.forEach((pedido) => {
      pedido.DetallePedido.forEach((detalle) => {
          total += detalle.Productos.precio * detalle.cantidad;
      });
    });
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
