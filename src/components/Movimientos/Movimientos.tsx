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
  const [movimientos, setMovimientos] = useState<IPedido[]>([]); // Cambia "pedidos" a "movimientos"
  const [filteredMovimientos, setFilteredMovimientos] = useState<IPedido[]>([]); // Estado para almacenar los movimientos filtrados
  const [movimientosConGananciaNeta, setMovimientosConGananciaNeta] = useState<IPedido[]>([]);

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
      })
      .catch(error => console.log(error));
  }, []);

  const calcularGananciaNeta = (movimientosData: IPedido[], ingredientesData: IIngredientes[]) => {
    return movimientosData.map((movimiento: IPedido) => {
      let costoTotalMovimiento = 0;
      movimiento.DetallePedido.forEach((detalle) => {
        if (Array.isArray(detalle.Productos)) {
          detalle.Productos.forEach((producto) => {
            if (Array.isArray(producto.ProductoIngrediente)) {
              producto.ProductoIngrediente.forEach((pi: { Ingredientes: { id: number; }; cantidad: number; }) => {
                // Buscar el ingrediente por su idIngredientes
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

  // Calcula la ganancia neta para cada movimiento al cargar los datos
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
                  console.log(ingredienteBusqueda)
                  if (ingrediente == ingredienteBusqueda) {
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
    { title: "Número de Pedido", field: "numeroPedido", width: 1 },
    { title: "Total del Pedido", field: "totalPedido", width: 1 },
    {
      title: "Precio de Costo",
      field: "esEfectivo",
      width: 1,
      render: (rowData) => {
        return <div>{calcularCostoTotalPedidos([rowData], ingredientes)}</div>;
      },
    },
    {
      title: "Ganancia Neta",
      field: "esEfectivo",
      width: 1,
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
        return fechaPedido >= startDate && fechaPedido <= endDate;
      });
      pedidosFiltrados.sort((a, b) => b.totalPedido - a.totalPedido);

      const costoTotalFiltrado = pedidosFiltrados.reduce((total, pedido) => total + calcularCostoTotalPedidos([pedido], ingredientes), 0);
      const ingresoTotalFiltrado = calcularIngresoTotalPedidos(pedidosFiltrados);
      const gananciaTotalFiltrada = ingresoTotalFiltrado - costoTotalFiltrado;

      setCostoTotal(costoTotalFiltrado);
      setIngresoTotal(ingresoTotalFiltrado);
      setGananciaTotal(gananciaTotalFiltrada);

      // Filtra los movimientos con ganancia neta basados en la búsqueda
      const movimientosFiltrados = movimientosConGananciaNeta.filter((movimiento) => {
        const fechaPedido = new Date(movimiento.fechaPedido);
        return fechaPedido >= startDate && fechaPedido <= endDate;
      });

      setFilteredMovimientos(pedidosFiltrados);
    } else {
      alert("Por favor, seleccione ambas fechas antes de realizar la búsqueda.");
    }
  };

  const exportDataToExcel = () => {
    // Obtén los datos que deseas exportar (en este caso, movimientosCalculados)
    const dataToExport = movimientosCalculados;

    // Define un nombre de archivo para el Excel
    const filename = "movimientos_excel";

    // Llama a la función de exportación a Excel
    exportTableDataToExcel(dataToExport, filename);
  };

    // Función para la búsqueda personalizada por número de factura
    const customDate=(firstDate:Date|null, secondDate:Date|null):Promise<IPedido[]>=>{
      return new Promise((resolve)=>{
        
        const filtrar=movimientos;
        let filtrados:IPedido[]=[];
        filtrar.map((factura)=>{
          const fecha=new Date(factura.fechaPedido);
          console.log(fecha);
          if((firstDate===null || fecha>=firstDate) && (secondDate===null || fecha<= secondDate)){
            filtrados.push(factura);
          }
        })
        resolve(filtrados);
      })
    }

  return (
    <div>
      <Container fluid>
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <GenericTable<IPedido>
              data={movimientosCalculados.sort((a, b) => b.totalPedido - a.totalPedido)}
              columns={columns}
              actions={{
                create: false,
                update: false,
                delete: false,
                view: false
              }}
              onAdd={handleAddModalOpen}
              customDate={customDate}
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
