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

  const API_URL = "/assets/data/ingredientesEjemplo.json";

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setIngredientes(data);
      })
      .catch((error) => {
        console.error("Error fetching ingredientes:", error);
      });
  }, []);

  // Verificar bajo stock después de cada actualización
  useEffect(() => {
    ingredientes.forEach((item) => {
      const difference = item.stockActual - item.stockMinimo;
      if (difference <= 0 || difference <= stockMinimoPercentage / 100 * item.stockMinimo) {
        window.alert(`${item.nombre} está bajo en stock o por llegar al minimo!`);
        return; // Salir del bucle si se muestra una alerta
      }
    });
  }, [ingredientes, stockMinimoPercentage]);

  const lowStockFilter = (item: IIngredientes) => {
    const difference = item.stockActual - item.stockMinimo;
    return difference <= 0 || difference <= stockMinimoPercentage / 100 * item.stockMinimo;
  };

  const openEditModal = () => {
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedIngrediente(null);
    setEditModalShow(false);
  };

  const handleIngredienteEdit = async (producto: IIngredientes) => {
    try {
      const updatedProducto = await handleRequest('PUT', `/assets/data/ingredientesEjemplo.json/${producto.id}`, producto);

      const newData = [...ingred];
      const index = newData.findIndex((item) => item.id === producto.id);
      newData[index] = updatedProducto;

      setIngred(newData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="display-6 text-center mb-3">Ingredientes Bajos de Stock</h2>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <Button
          variant="success"
          className="me-2"
          onClick={openEditModal}
        >
          Comprar <h3 className="mb-0"><i className="bi bi-cart-plus-fill"></i></h3>
        </Button>
      </div>
      <Table responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock Mínimo</th>
            <th>Stock Actual</th>
            <th>Stock Dif</th>
            <th>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.map((item, index) => (
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
