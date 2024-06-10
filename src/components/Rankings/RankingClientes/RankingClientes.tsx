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
          response.data.sort((a: IPedidoDto, b: IPedidoDto) =>
            new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
          setPedidos(response.data);
        } catch (error) {
          console.log('Error fetching pedidos:', error);
        }
      };

      fetchPedidos();
    }, []);

    const columns: IColumn<IPedidoDto>[] = [
      {
        title: "Nombre Completo",
        field: "usuario",
        render: rowData => <span>{`${rowData.usuario.nombre} ${rowData.usuario.apellido}`}</span>
      },
      { title: "Email", field: "usuario", render: rowData => <span>{rowData.usuario.email}</span> },
      { title: "Teléfono", field: "usuario", render: rowData => <span>{rowData.usuario.telefono}</span> },
      { title: "Estado", field: "estadoPedido" },
      {
        title: "Fecha del Último Pedido",
        field: "fechaPedido",
        render: rowData => {
          return rowData.fechaPedido ? <span>{rowData.fechaPedido}</span> : <span>-</span>;
        }
      },
      {
        title: "Cantidad de Pedidos",
        field: "usuario",
        render: rowData => <span>{calcularCantidadTotalPedidos(rowData.usuario)}</span>
      },
      {
        title: "Total Pedidos",
        field: "usuario",
        render: rowData => <span>{calcularTotalPedidos(rowData.usuario)}</span>
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

    const calcularCantidadTotalPedidos = (usuario: IPedidoDto['usuario']) => {
      let cantidadTotalPedidos = 0;
      pedidos.forEach(pedido => {
        if (pedido.usuario.id === usuario.id) {
          cantidadTotalPedidos += 1;
        }
      });
      return cantidadTotalPedidos;
    };

    const calcularTotalPedidos = (usuario: IPedidoDto['usuario']) => {
      let totalPedidos = 0;
      pedidos.forEach(pedido => {
        if (pedido.usuario.id === usuario.id) {
          totalPedidos += calcularTotalPedido(pedido.detallesPedidos);
        }
      });
      return totalPedidos;
    };

    const calcularTotalPedido = (detallesPedidos: IDetallePedido[]) => {
      let totalPedido = 0;
      detallesPedidos.forEach(detalle => {
        totalPedido += detalle.producto.precio * detalle.cantidad;
      });
      return totalPedido;
    };

    const exportToExcel = () => {
      if (pedidos.length > 0) {
        const dataToExport: any[] = [];
        const usuariosProcesados = new Set(); // Para evitar procesar al mismo usuario más de una vez
        pedidos.forEach(pedido => {
          const usuario = pedido.usuario;
          if (!usuariosProcesados.has(usuario.id)) {
            dataToExport.push({
              "Nombre Completo": `${usuario.nombre} ${usuario.apellido}`,
              Email: usuario.email,
              Teléfono: usuario.telefono,
              Estado: usuario.activo ? "Activo" : "Inactivo",
              "Cantidad de Pedidos": calcularCantidadTotalPedidos(usuario),
              "Total Pedidos": calcularTotalPedidos(usuario),
            });
            usuariosProcesados.add(usuario.id);
          }
        });
        exportTableDataToExcel(dataToExport, "Pedidos");
      }
    };

    // Agrupa los pedidos por usuario y muestra solo un usuario con toda la información
    const pedidosPorUsuario = pedidos.reduce((acc: IPedidoDto[], pedido) => {
      const existingUserIndex = acc.findIndex(user => user.usuario.id === pedido.usuario.id);
      if (existingUserIndex === -1) {
        acc.push(pedido);
      }
      return acc;
    }, []);

    // Filtra y ordena los pedidos según la cantidad seleccionada y el orden seleccionado
    const pedidosFiltrados = pedidosPorUsuario.sort((a, b) => {
      if (filtroCantidad === "cantidad pedido") {
        const cantidadA = calcularCantidadTotalPedidos(a.usuario);
        const cantidadB = calcularCantidadTotalPedidos(b.usuario);
        return filtroOrden === "Ascendente" ? cantidadA - cantidadB : cantidadB - cantidadA;
      } else {
        const totalA = calcularTotalPedidos(a.usuario);
        const totalB = calcularTotalPedidos(b.usuario);
        return filtroOrden === "Ascendente" ? totalA - totalB : totalB - totalA;
      }
    });

    const customSearch = async (searchText: string) => {
      // Filtrar los datos por nombre, apellido y teléfono
      const filteredData = pedidos.filter((item) =>
        item.usuario.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        item.usuario.apellido.toLowerCase().includes(searchText.toLowerCase()) ||
        item.usuario.telefono.toLowerCase().includes(searchText.toLowerCase())
      );
      return filteredData;
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
              {pedidosPorUsuario && pedidosPorUsuario.length > 0 ? (
                <GenericTable<IPedidoDto>
                  data={pedidosFiltrados}
                  columns={columns}
                  actions={{
                    create: false,
                    update: false,
                    delete: false,
                    view: false,
                  }}
                  showDate={true}
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