import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import GenericTable from "../../GenericTable/GenericTable";
import axios from "axios";
import { exportTableDataToExcel } from "../../../util/exportTableDataToExcel";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import { IPedidoDto } from "../../../interface/IPedido";
import { IDetallePedido } from "../../../interface/IDetallePedido";
import { Link } from "react-router-dom";
import NoHayPedidos from "../../Page404/NoHayPedidos";

const RankingClientes = () => {
  const [pedidos, setPedidos] = useState<IPedidoDto[]>([]);
  const [filtroCantidad, setFiltroCantidad] = useState<string>("cantidad pedido");
  const [filtroOrden, setFiltroOrden] = useState<string>("Descendente");
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get<IPedidoDto[]>(`${API_URL}pedido`);
        const pedidosCliente = response.data.filter(pedido => pedido.usuario.rol.nombreRol === 'Cliente');
        pedidosCliente.sort((a: IPedidoDto, b: IPedidoDto) =>
          new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
        setPedidos(pedidosCliente);
      } catch (error) {
        console.log('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const calcularTotalPedido = (detallesPedidos: IDetallePedido[]) => {
    let totalPedido = 0;
    detallesPedidos.forEach(detalle => {
      totalPedido += detalle.producto.precio * detalle.cantidad;
    });
    return totalPedido;
  };

  // Agrupa los pedidos por usuario y calcula las cantidades y totales
  const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
    const usuario = pedido.usuario;
    const existingUser = acc.find(item => item.usuario.id === usuario.id);

    if (existingUser) {
      existingUser.cantidadPedidos += 1;
      existingUser.totalPedidos += calcularTotalPedido(pedido.detallesPedidos);
      existingUser.fechaPedido = new Date(pedido.fechaPedido) > new Date(existingUser.fechaPedido) ? pedido.fechaPedido : existingUser.fechaPedido;
    } else {
      acc.push({
        usuario,
        estadoPedido: pedido.estadoPedido,
        fechaPedido: pedido.fechaPedido,
        cantidadPedidos: 1,
        totalPedidos: calcularTotalPedido(pedido.detallesPedidos),
      });
    }

    return acc;
  }, [] as Array<{
    usuario: IPedidoDto['usuario'],
    estadoPedido: string,
    fechaPedido: Date,
    cantidadPedidos: number,
    totalPedidos: number
  }>);

  const columns: IColumn<any>[] = [
    {
      title: "Nombre Completo",
      field: "usuario",
      render: rowData => <span>{`${rowData.usuario.nombre} ${rowData.usuario.apellido}`}</span>
    },
    { title: "Email", field: "usuario", render: rowData => <span>{rowData.usuario.email}</span> },
    { title: "Teléfono", field: "usuario", render: rowData => <span>{rowData.usuario.telefono}</span> },
    // { title: "Estado", field: "estadoPedido" },
    {
      title: "Fecha del Último Pedido",
      field: "fechaPedido",
      render: rowData => {
        return rowData.fechaPedido ? <span>{new Date(rowData.fechaPedido).toLocaleString()}</span> : <span>-</span>;
      }
    },
    {
      title: "Cantidad de Pedidos",
      field: "cantidadPedidos",
      render: rowData => <span>{rowData.cantidadPedidos}</span>
    },
    {
      title: "Total Pedidos",
      field: "totalPedidos",
      render: rowData => <span>{rowData.totalPedidos}</span>
    },
    {
      title: "Ver Pedidos",
      field: "usuario",
      render: rowData => (
        <span>
          <Link to={`/admin/ranking-pedidos/${rowData.usuario.id}`} className="btn btn-primary me-2">
            Ver <i className="bi bi-file-earmark-text-fill me-1"></i>
          </Link>
        </span>
      )
    }
  ];

  const handleCantidadFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cantidadSeleccionada = event.target.value;
    setFiltroCantidad(cantidadSeleccionada);
  };

  const handleOrdenFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const ordenSeleccionada = event.target.value;
    setFiltroOrden(ordenSeleccionada);
  };

  const exportToExcel = () => {
    if (pedidosAgrupados.length > 0) {
      const dataToExport = pedidosAgrupados.map(usuario => ({
        "Nombre Completo": `${usuario.usuario.nombre} ${usuario.usuario.apellido}`,
        Email: usuario.usuario.email,
        Teléfono: usuario.usuario.telefono,
        // Estado: usuario.estadoPedido,
        "Cantidad de Pedidos": usuario.cantidadPedidos,
        "Total Pedidos": usuario.totalPedidos,
      }));
      exportTableDataToExcel(dataToExport, "Pedidos");
    }
  };

  // Filtra y ordena los pedidos según la cantidad seleccionada y el orden seleccionado
  const pedidosFiltrados = pedidosAgrupados.sort((a, b) => {
    if (filtroCantidad === "cantidad pedido") {
      return filtroOrden === "Ascendente" ? a.cantidadPedidos - b.cantidadPedidos : b.cantidadPedidos - a.cantidadPedidos;
    } else {
      return filtroOrden === "Ascendente" ? a.totalPedidos - b.totalPedidos : b.totalPedidos - a.totalPedidos;
    }
  });

  const customSearch = async (searchText: string) => {
    // Filtrar los datos por nombre, apellido y teléfono
    const filteredData = pedidosAgrupados.filter((item) =>
      item.usuario.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      item.usuario.apellido.toLowerCase().includes(searchText.toLowerCase()) ||
      item.usuario.telefono.toLowerCase().includes(searchText.toLowerCase())
    );
    return filteredData;
  };

  const customDateSearch = async (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return pedidos;
    const filtered = pedidos.filter(pedido => {
      const pedidoFecha = new Date(pedido.fechaPedido);
      return pedidoFecha >= startDate && pedidoFecha <= endDate;
    });
    return filtered;
  };

  return (
    <div>
      <Container fluid>
        <Row className="mt-3 align-items-center">
          <Col xs="auto">
            <Form.Select value={filtroCantidad} onChange={handleCantidadFiltroChange}>
              <option value="cantidad pedido">Cantidad pedido</option>
              <option value="total pedido">Total Pedido</option>
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Form.Select value={filtroOrden} onChange={handleOrdenFiltroChange}>
              <option value="Ascendente">Ascendente</option>
              <option value="Descendente">Descendente</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            {pedidosAgrupados && pedidosAgrupados.length > 0 ? (
              <GenericTable<any>
                data={pedidosFiltrados}
                columns={columns}
                actions={{
                  create: false,
                  update: false,
                  delete: false,
                  view: false,
                }}
                showDate={true}
                customDate={customDateSearch}
                customSearch={customSearch}
                placeHolder="Buscar por Nombre/Apellido/Teléfono"
              />
            ) : (
              <NoHayPedidos onReload={() => window.location.reload()} />
            )}
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