import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Pedido } from "../../interface/Pedido";
import Buscador from "../Buscador/Buscador";
import PedidoList from "../Pedidos/PedidoList";

const CajeroPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosComplete, setPedidosComplete] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("assets/data/pedidos.json");
        const data = await response.json();
        setPedidos(data);
        setPedidosComplete(data);
      } catch (error) {
        console.log(error);
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
    const searchResult = pedidosComplete.filter((pedido: Pedido) =>
      pedido.idPedido.toString().toLowerCase().includes(searchParam.toLowerCase())
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

  // Manejar el cambio de estado en el filtro
  const handleEstadoFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(event.target.value);
    setPedidoSeleccionado(null); // Reiniciar el pedido seleccionado
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
