import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GenericTable from '../GenericTable/GenericTable';
import { IColumn } from '../../interface/ICamposTablaGenerica';
import { IPedido } from "../../interface/IPedido";
import { IIngredientes } from '../../interface/IIngredientes';
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';

const Movimientos = () => {
  const [ingredientes, setIngredientes] = useState<IIngredientes[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [costoTotal, setCostoTotal] = useState<number | null>(null);
  const [addModalShow, setAddModalShow] = useState(false);
  const [ingresoTotal, setIngresoTotal] = useState<number | null>(null);
  const [gananciaTotal, setGananciaTotal] = useState<number | null>(null);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [movimientos, setMovimientos] = useState<IPedido[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState<IPedido[]>([]);
  const [movimientosConGananciaNeta, setMovimientosConGananciaNeta] = useState<IPedido[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const API_URL = "assets/data/ingredientesEjemplo.json";
    const API_URL_pedido = "assets/data/pedidos.json";

    Promise.all([
      fetch(API_URL).then(response => response.json()),
      fetch(API_URL_pedido).then(response => response.json())
    ])
      .then(([ingredientesData, pedidosData]) => {
        setIngredientes(ingredientesData);
        setPedidos(pedidosData);
        const movimientosCalculados = calcularGananciaNeta(pedidosData, ingredientesData);
        setMovimientosConGananciaNeta(movimientosCalculados);
        setMovimientos(movimientosCalculados);
        setFilteredMovimientos(movimientosCalculados);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleDateChangeStart = (date: Date | null) => {
    setStartDate(date);
    handleDateChange();
  };

  const handleDateChangeEnd = (date: Date | null) => {
    setEndDate(date);
    handleDateChange();
  };

  const handleDateChange = () => {
    if (startDate !== null && endDate !== null) {
      const movimientosFiltrados = movimientosConGananciaNeta.filter((movimiento) => {
        const fechaPedido = new Date(movimiento.fechaPedido);
        return fechaPedido >= startDate && fechaPedido <= endDate;
      });

      setFilteredMovimientos(movimientosFiltrados);
    }
  };

  const calcularGananciaNeta = (movimientosData: IPedido[], ingredientesData: IIngredientes[]) => {
    return movimientosData.map((movimiento: IPedido) => {
      let costoTotalMovimiento = 0;
      movimiento.DetallePedido.forEach((detalle) => {
        if (Array.isArray(detalle.Productos)) {
          detalle.Productos.forEach((producto) => {
            if (Array.isArray(producto.ProductoIngrediente)) {
              producto.ProductoIngrediente.forEach((pi: { Ingredientes: { id: number; }; cantidad: number; }) => {
                return ingredientesData.map((ingrediente: IIngredientes) => {
                  const ingredienteBusqueda = ingredientes.find(ing => ing.id === pi.Ingredientes.id);
                  if (ingrediente == ingredienteBusqueda) {
                    costoTotalMovimiento += pi.cantidad * ingredienteBusqueda.precioCosto;
                  }
                })
              });
            }
          });
        }
      });
      const gananciaNeta = movimiento.totalPedido - costoTotalMovimiento;
      return {
        ...movimiento,
        ...ingredientes,
        gananciaNeta: gananciaNeta,
      };
    });
  };

  const movimientosCalculados = calcularGananciaNeta(pedidos, ingredientes);

  const calcularCostoTotalPedidos = (movimientosData: IPedido[], ingredientesData: IIngredientes[]) => {
    let costoTotal = 0;
    movimientosData.forEach((movimiento: IPedido) => {
      movimiento.DetallePedido.forEach((detalle) => {
        if (Array.isArray(detalle.Productos)) {
          detalle.Productos.forEach((producto) => {
            if (Array.isArray(producto.ProductoIngrediente)) {
              producto.ProductoIngrediente.forEach((pi: { Ingredientes: { id: number; }; cantidad: number; }) => {
                ingredientesData.forEach((ingrediente: IIngredientes) => {
                  const ingredienteBusqueda = ingredientesData.find(ing => ing.id === pi.Ingredientes.id);
                  if (ingredienteBusqueda) {
                    costoTotal += pi.cantidad * ingredienteBusqueda.precioCosto;
                  }
                });
              });
            }
          });
        }
      });
    });
    return costoTotal;
  };

  const columns: IColumn<IPedido>[] = [
    { title: "Fecha de Pedido", field: "fechaPedido", width: 2 },
    { title: "Número de Pedido", field: "numeroPedido", width: 2 },
    {
      title: "Cliente", field: "Usuario",
      render: (pedido: IPedido) => (
        <span>{`${pedido.Usuario.apellido} ${pedido.Usuario.nombre}`}</span>
      ),
      width: 2
    },
    { title: "Total del Pedido", field: "totalPedido", width: 2 },
    {
      title: "Precio de Costo",
      field: "esEfectivo",
      width: 2,
      render: (rowData) => {
        return <div>{calcularCostoTotalPedidos([rowData], ingredientes)}</div>;
      },
    },
    {
      title: "Ganancia Neta",
      field: "esEfectivo",
      width: 2,
      render: (rowData) => {
        const gananciaNeta = calcularGananciaNeta([rowData], ingredientes)[0].gananciaNeta;
        return <div>{gananciaNeta}</div>;
      },
    },
  ];

  const calcularIngresoTotalPedidos = (pedidosFiltrados: IPedido[]) => {
    return pedidosFiltrados.reduce((total, pedido) => total + pedido.totalPedido, 0);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleBuscarClick = () => {     
  if (startDate !== null && endDate !== null) {
    const pedidosFiltrados = pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fechaPedido);
      const searchTermLowerCase = searchTerm.toLowerCase();
      const nombreUsuario = pedido.Usuario.nombre.toLowerCase();
      const apellidoUsuario = pedido.Usuario.apellido.toLowerCase();

      return (
        (fechaPedido >= startDate && fechaPedido <= endDate) &&
        (pedido.numeroPedido.toString().includes(searchTermLowerCase) ||
          nombreUsuario.includes(searchTermLowerCase) ||
          apellidoUsuario.includes(searchTermLowerCase))
      );
    });

    const movimientosFiltrados = movimientosCalculados.filter((movimiento) => {
      const fechaPedido = new Date(movimiento.fechaPedido);
      return fechaPedido >= startDate && fechaPedido <= endDate;
    });
    
   pedidosFiltrados.sort((a, b) => b.totalPedido - a.totalPedido);

    const costoTotalFiltrado = pedidosFiltrados.reduce((total, pedido) => total + calcularCostoTotalPedidos([pedido], ingredientes), 0);
    const ingresoTotalFiltrado = calcularIngresoTotalPedidos(pedidosFiltrados);
    const gananciaTotalFiltrada = ingresoTotalFiltrado - costoTotalFiltrado;

    setCostoTotal(costoTotalFiltrado);
    setIngresoTotal(ingresoTotalFiltrado);
    setGananciaTotal(gananciaTotalFiltrada);

    setFilteredMovimientos(movimientosFiltrados);
  } else {
    alert("Por favor, seleccione ambas fechas antes de realizar la búsqueda.");
  }
};

  const exportDataToExcel = () => {
    const dataToExport = movimientosCalculados;
    const filename = "movimientos_excel";
    exportTableDataToExcel(dataToExport, filename);
  };

  return (
    <div>
      <Container fluid>
        <Row className="mt-2">
          <Col>
            <Form>
              <Form.Group>
                <Form.Label>Fecha inicio búsqueda</Form.Label>
                <Col>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChangeStart}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    className="form-control"
                  />
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Group>
                <Form.Label>Fecha fin búsqueda</Form.Label>
                <Col>
                  <DatePicker
                    selected={endDate}
                    onChange={handleDateChangeEnd}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    className="form-control"
                  />
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Button variant="primary" style={{ marginTop: "30px" }} onClick={handleBuscarClick}>Buscar por fechas</Button>
          </Col>
        </Row>
        <Row className="mt-3" style={{}}>
          <Col className="d-flex justify-content-center">
            <GenericTable<IPedido>
              data={filteredMovimientos.sort((a, b) => b.totalPedido - a.totalPedido)}
              columns={columns}
              actions={{
                create: false,
                update: false,
                delete: false,
                view: false
              }}
              onAdd={handleAddModalOpen}
              showDate={true}
            />
          </Col>
        </Row>
        <Button variant="success" onClick={() => exportDataToExcel()}>Exportar a Excel</Button>
      </Container>
    </div>
  );
};

export default Movimientos;
