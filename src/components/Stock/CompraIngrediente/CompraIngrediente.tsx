import React, { useState, useEffect } from 'react';
import { IIngredientes } from '../../../interface/IIngredientes';
import EditCompraIngredientesModal from './EditCompraIngredientesModal';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import { Button, Table } from 'react-bootstrap';

const CompraIngrediente: React.FC = () => {
    const [ingredientes, setIngredientes] = useState<IIngredientes[]>([]);
    const stockMinimoPercentage = 20;
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedIngrediente, setSelectedIngrediente] = useState<IIngredientes | null>(null);
    const [ingred, setIngred] = useState<IIngredientes[]>([]);
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        // Simulando una llamada a la API para obtener los ingredientes
        fetch(API_URL + "ingrediente")
            .then((response) => response.json())
            .then((data) => {
                setIngredientes(data);
                console.log(data)
            })
            .catch((error) => {
                console.error("Error fetching ingredientes:", error);
            });
    }, []);

    // Función para filtrar ingredientes con stock bajo
    const lowStockFilter = (item: IIngredientes) => {
        const difference = item.stockActual - item.stockMinimo;
        return difference <= 0 || difference <= stockMinimoPercentage / 100 * item.stockMinimo;
    };

    // Función para abrir el modal de edición
    const openEditModal = () => {
        setEditModalShow(true);
    };

    // Función para cerrar el modal de edición
    const handleEditModalClose = () => {
        setSelectedIngrediente(null);
        setEditModalShow(false);
    };

    // Función para manejar la edición de ingredientes
    const handleIngredienteEdit = async (producto: IIngredientes) => {
        try {
            // Realizar una solicitud PUT simulada para actualizar los datos del ingrediente
            const updatedProducto = await handleRequest('PUT', `${API_URL + "ingrediente"}/${producto.id}`, producto);

            // Actualizar los datos del ingrediente en el estado
            const newData = [...ingred];
            const index = newData.findIndex((item) => item.id === producto.id);
            newData[index] = updatedProducto;

            setIngred(newData); // Actualizar el estado con los nuevos datos
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h2 className="display-6 text-center mb-3">Ingredientes Bajos de Stock</h2>
            <div className="d-flex justify-content-start align-items-center mb-3">
                {/* Botón para abrir el modal de compra */}
                <Button
                    variant="success"
                    className="me-2"
                    onClick={openEditModal}
                >
                    Comprar <h3 className="mb-0"><i className="bi bi-cart-plus-fill"></i></h3>
                </Button>
            </div>
            {/* Tabla de ingredientes */}
            <Table responsive className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Stock Mínimo</th>
                        <th>Stock Actual</th>
                        <th>Stock Diferencia</th>
                        <th>Unidad de Medida</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredientes.filter(lowStockFilter).map((item, index) => (
                        <tr key={index}>
                            <td>{item.nombre}</td>
                            <td>{item.stockMinimo}</td>
                            <td>{item.stockActual}</td>
                            <td>
                                <span className={`badge ${item.stockActual - item.stockMinimo < 0 ? 'bg-danger' : 'bg-success'}`}>
                                    {`${item.stockActual - item.stockMinimo}`}
                                </span>
                            </td>
                            <td>{item.unidadMedida}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Modal de edición de compra de ingredientes */}
            <EditCompraIngredientesModal
                show={editModalShow}
                handleClose={handleEditModalClose}
                handleIngredientesEdit={handleIngredienteEdit}
                selectedIngredientes={selectedIngrediente}
            />
        </div>
    );
};

export default CompraIngrediente;
