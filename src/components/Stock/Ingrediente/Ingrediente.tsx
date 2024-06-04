
import React, { useState, useEffect } from 'react';
import { Container, Form, Row } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { IIngredientes } from '../../../interface/IIngredientes';
import { IRubroNew } from "../../../interface/IRubro";
import axios from 'axios';
import GenericTable from "../../GenericTable/GenericTable";
import { IColumn } from '../../../interface/ICamposTablaGenerica';

const Ingrediente: React.FC = () => {
    // Estados del componente
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedIngrediente, setSelectedIngrediente] = useState<IIngredientes | null>(null);
    const [ingredComplete, setIngredComplete] = useState<IIngredientes[]>([]);
    const [rubros, setRubros] = useState<IRubroNew[]>([]);
    const [selectedRubro, setSelectedRubro] = useState<number | null>(null);
    const [filteredIngredientes, setFilteredIngredientes] = useState<IIngredientes[]>([]);
    const API_URL = process.env.REACT_APP_API_URL || "";

    // Configuración de acciones y columnas de la tabla
    const actions = {
        create: true,
        update: true
    };

    const columns: IColumn<IIngredientes>[] = [
        // Definición de las columnas...
        { title: 'ID', field: 'id' },
        { title: 'Nombre', field: 'nombre' },
        {
            title: 'Rubro', field: 'rubro', render: (ingredientes: IIngredientes) =>
                <span>{`${ingredientes.rubro ? ingredientes.rubro.nombre || "" : ""}`}</span>
        },
        { title: 'Precio', field: 'precioCosto' },
        { title: 'Min Stock', field: 'stockMinimo' },
        { title: 'Stock Actual', field: 'stockActual' },
        { title: 'UM', field: 'unidadMedida' },
        {
            title: "Estado",
            field: "activo",
            render: (ingredientes: IIngredientes) => (
                <span className={`${ingredientes.activo ? "text-success" : "text-danger"}`}>
                    {ingredientes.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
                </span>
            ),
        },
    ];

    // Filtrar ingredientes según el rubro seleccionado
    useEffect(() => {
        const filterIngredientes = () => {
            if (selectedRubro) {
                const filtered = ingredComplete.filter(
                    (ingrediente) => ingrediente.rubro.id === selectedRubro
                );
                setFilteredIngredientes(filtered);
            } else {
                setFilteredIngredientes(ingredComplete);
            }
        };

        if (ingredComplete.length > 0) {
            filterIngredientes();
        }
    }, [selectedRubro, ingredComplete]);

    // Cargar ingredientes y rubros al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            // Obtener ingredientes desde la API
            const url = API_URL + "ingrediente";
            try {
                const responseData = await axios.get(url);
                setIngredComplete(responseData.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchRubros = async () => {
            try {
                const responseData = await axios.get<IRubroNew[]>(API_URL + "rubro");
                const filteredRubros = responseData.data.filter(rubro => rubro.ingredientOwner);
                setRubros(filteredRubros);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRubros();
        fetchData();
    }, [API_URL]);

    // Agregar nuevo ingrediente mediante la API
    const handleIngredienteAdd = async (newIngrediente: IIngredientes) => {
        try {
            const response = await axios.post(`${API_URL}ingrediente`, newIngrediente);
            if (response.data) {
                setIngredComplete([...ingredComplete, response.data]);
                setFilteredIngredientes([...filteredIngredientes, response.data]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Editar ingrediente existente mediante la API
    const handleIngredienteEdit = async (updatedIngrediente: IIngredientes) => {
        try {
            const response = await axios.put(`${API_URL}ingrediente/${updatedIngrediente.id}`, updatedIngrediente);
            if (response.data) {
                const updatedIngreds = ingredComplete.map(item => (item.id === updatedIngrediente.id ? response.data : item));
                setIngredComplete(updatedIngreds);
                setFilteredIngredientes(updatedIngreds);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Abrir modal de edición con los datos del ingrediente
    const handleEditModalOpen = (item: IIngredientes) => {
        setSelectedIngrediente(item);
        setEditModalShow(true);
    };

    // Cerrar modal de edición
    const handleEditModalClose = () => {
        setSelectedIngrediente(null);
        setEditModalShow(false);
    };

    // Abrir modal de agregar
    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    // Cerrar modal de agregar
    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    // Manejar cambio de selección de rubro
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        const selectedRubroId = parseInt(value);
        setSelectedRubro(selectedRubroId ? selectedRubroId : null);
    };

   

    return (
        
            <Container fluid>
                <Row>
                    {/* Filtros y mensajes */}
                    <Form.Group controlId="id">
                        <select
                            className="form-select"
                            name="id"
                            value={selectedRubro ? selectedRubro : ""}
                            onChange={handleSelectChange}
                            style={{ width: "250px", margin: "10px" }}
                        >
                            <option value="">Todos los rubros</option>
                            {rubros.map((rubro) => (
                                <option key={rubro.id} value={rubro.id}>
                                    {rubro.nombre || ""}
                                </option>
                            ))}
                        </select>
                    </Form.Group>
                    
                    {/* Tabla de ingredientes */}
                    <GenericTable
                        data={filteredIngredientes}
                        columns={columns}
                        actions={actions}
                        onAdd={handleAddModalOpen}
                        onUpdate={handleEditModalOpen}
                        placeHolder="Buscar por Nombre"
                    />
                </Row>
                {/* Modales de edición y adición */}
                <EditIngredienteModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleIngredientesEdit={handleIngredienteEdit}
                    selectedIngredientes={selectedIngrediente}
                />
                <AddIngredienteModal
                    show={addModalShow}
                    handleClose={handleAddModalClose}
                    handleIngredienteAdd={handleIngredienteAdd}
                />
            </Container>
        
    );
};

export default Ingrediente;