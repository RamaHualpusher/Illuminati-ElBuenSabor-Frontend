import React, { useState } from 'react';
import { Modal, Button, Table, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { IPedidoDtoVuelto } from '../../interface/IPedido';
import { IDetallePedido } from '../../interface/IDetallePedido';

interface ModalModificarPedidoProps {
    pedido: IPedidoDtoVuelto;
    onHide: () => void;
    show: boolean;
    onSave: (pedidoModificado: IPedidoDtoVuelto) => void;
}

const ModalModificarPedido: React.FC<ModalModificarPedidoProps> = ({ pedido, onHide, show, onSave }) => {
    const [detallesPedidos, setDetallesPedidos] = useState<IDetallePedido[]>(pedido.detallesPedidos);

    const handleIngredienteCantidadChange = (index: number, ingIndex: number, cantidad: number) => {
        const nuevosDetalles = [...detallesPedidos];
        const producto = nuevosDetalles[index]?.producto;
        if (producto) {
            const productosIngredientes = producto.productosIngredientes;
            if (productosIngredientes) {
                productosIngredientes[ingIndex].cantidad = cantidad;
                setDetallesPedidos(nuevosDetalles);
            }
        }
    };

    const handleSave = async () => {
        const pedidoModificado = { ...pedido, detallesPedidos };

        try {
            await axios.post('/pedido/aumentarStockIngrediente', pedidoModificado);
            onSave(pedidoModificado);
            onHide();
        } catch (error) {
            console.error('Error al modificar el pedido:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" dialogClassName="modal-dialog-scrollable">
            <Modal.Header closeButton>
                <Modal.Title>Modificar Pedido <span className='text-success'>#{pedido.id}</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>Ingredientes</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Ingredientes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detallesPedidos.map((detalle, index) => (
                            <tr key={index}>
                                <td>{detalle.producto.nombre}</td>
                                <td>
                                    <ul>
                                        {detalle.producto.productosIngredientes?.map((prodIngrediente, ingIndex) => (
                                            <li key={ingIndex}>
                                                {prodIngrediente.ingrediente.nombre} - {prodIngrediente.cantidad} {prodIngrediente.ingrediente.unidadMedida}
                                                <FormControl
                                                    type="number"
                                                    value={prodIngrediente.cantidad}
                                                    onChange={(e) => handleIngredienteCantidadChange(index, ingIndex, Number(e.target.value))}
                                                />
                                                <span className="input-group-text">
                                                    {prodIngrediente.ingrediente.unidadMedida}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalModificarPedido;
