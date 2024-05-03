import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { IPedidoDto } from "../../interface/IPedido";
import Buscador from "../Buscador/Buscador";
import PedidoList from "../Pedidos/PedidoList";
import axios from "axios";

const CajeroPage = () => {
  const [pedidos, setPedidos] = useState<IPedidoDto[]>([]);
  const [pedidosComplete, setPedidosComplete] = useState<IPedidoDto[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedidoDto | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Cargar los pedidos desde una fuente de datos al cargar el componente
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`${API_URL}pedido`); // Llama al endpoint de pedidos
        // Ordenar los pedidos por fecha de pedido de manera descendente
        response.data.sort((a: IPedidoDto, b: IPedidoDto) =>
          new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
        console.log('Response from API:', response); // Log del response de la API
        setPedidos(response.data);
        setPedidosComplete(response.data);
      } catch (error) {
        console.log('Error fetching pedidos:', error); // Log del error al obtener pedidos
      }
    };

    fetchPedidos();
  }, []);

  // Filtrar los pedidos según el estado seleccionado
  const filteredPedidos = pedidos.filter((pedido) => {
    if (filtroEstado === "") {
      return true;
    } else {
      return pedido.estadoPedido === filtroEstado;
    }
  });

  // Filtrar pedidos completos en función de un parámetro de búsqueda
  const filter = (searchParam: string) => {
    const searchResult = pedidosComplete.filter((pedido: IPedidoDto) =>
      pedido.id && pedido.id.toString().toLowerCase().includes(searchParam.toLowerCase())
    );
    setPedidos(searchResult);
  };

  // Manejar la búsqueda
  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  // Cambiar el estado de un pedido seleccionado
  const cambiarEstadoPedido = (nuevoEstado: string) => {
    if (pedidoSeleccionado) {
      const { estadoPedido, esDelivery, esEfectivo } = pedidoSeleccionado;

      if (
        (estadoPedido === "A confirmar" && nuevoEstado === "A cocina") ||
        (estadoPedido === "A confirmar" && nuevoEstado === "Listo") ||
        (estadoPedido === "En cocina" && nuevoEstado === "Listo") ||
        (estadoPedido === "Listo" && nuevoEstado === "En delivery" && esDelivery) ||
        (estadoPedido === "Listo" && nuevoEstado === "Entregado" && esDelivery && esEfectivo)
      ) {
        setPedidoSeleccionado({ ...pedidoSeleccionado, estadoPedido: nuevoEstado });
      }
    }
  };

  //cambio realizado 26/1/2024
  // Cambiar el estado de un pedido seleccionado
  const handleEstadoFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const estadoSeleccionado = event.target.value;
    setFiltroEstado(estadoSeleccionado);
    setPedidoSeleccionado(null); // Reiniciar el pedido seleccionado

    // Filtrar los pedidos según el estado seleccionado
    const pedidosFiltrados = pedidosComplete.filter((pedido) => {
      if (estadoSeleccionado === "") {
        return true;
      } else {
        return pedido.estadoPedido === estadoSeleccionado;
      }
    });

    setPedidos(pedidosFiltrados);
  };

  return (
    <div className="container mt-3">
      <div className="header-container container-sm text-center">
        <h1 className="mx-auto display-4">Pedidos Pendientes</h1>
        <Row className="align-items-center">
          <Col xs="auto">
            {/* Selector para filtrar por estado */}
            <Form.Select value={filtroEstado} onChange={handleEstadoFiltroChange}>
              <option value="">Todos los estados</option>
              <option value="A confirmar">A confirmar</option>
              <option value="En cocina">En cocina</option>
              <option value="Listo">Listo</option>
              <option value="En delivery">En delivery</option>
              <option value="Entregado">Entregado</option>
            </Form.Select>
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-3">
          {/* Componente de buscador */}
          <Buscador onSearch={handleSearch} />
        </div>
      </div>
      {/* Lista de pedidos */}
      <PedidoList pedidos={filteredPedidos} cambiarEstadoPedido={cambiarEstadoPedido} />
    </div>
  );
};

export default CajeroPage;