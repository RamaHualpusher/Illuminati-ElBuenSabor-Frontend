import React, { useState, useEffect } from "react";
import { IUsuario } from "../../../interface/IUsuario";
import { IEditUsuarioFromAdmin } from "../../../interface/IUsuario";
import { IAction, IColumn } from '../../../interface/ICamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";
import { Container, Row, Col, Form } from 'react-bootstrap';
import EditEmpleadoModal from "./EditEmpleadoModal";
import AddEmpleadoModal from "./AddEmpleadoModal";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";

const Empleados = () => {
    //Estados del componente
    const [empleados, setEmpleados] = useState<IUsuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<IEditUsuarioFromAdmin | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || "";
    const [filterOption, setFilterOption] = useState<string>("all"); // Puedes inicializarlo con "all"

    //Acciones que se pueden realizar
    const actions: IAction = {
        create: true,
        update: true,
        delete: true
    };

    const columns: IColumn<IUsuario>[] = [
        // Definir columnas de la tabla
        { title: 'ID Usuario', field: 'id' },
        { title: 'Nombre', field: 'nombre' },
        { title: 'Apellido', field: 'apellido' },
        { title: 'Email', field: 'email' },
        {
            title: 'Rol', field: 'rol', render: (usuario: IUsuario) =>
                <span>{`${usuario.rol ? usuario.rol.nombreRol : ''}`}</span>
        },
        {
            title: "Estado",
            field: "activo",
            render: (usuario: IUsuario) => (
                <span className={`${usuario.activo ? "text-success" : "text-danger"}`}>
                    {usuario.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
                </span>
            ),
        },

    ];

    // Función para busqueda personalizada por ID y nombre
    const customSearch = (searchText: string): Promise<IUsuario[]> => {
        return new Promise((resolve) => {
            const normalizedSearchText = normalizeString(searchText);

            const filteredData = empleados.filter((empleado) => {
                const normalizedIdUsuario = empleado.id ? normalizeString(empleado.id.toString()) : '';
                const normalizedNombre = normalizeString(empleado.nombre.toString());
                const normalizedApellido = normalizeString(empleado.apellido.toString());

                return (
                    (filterOption === "all" || (filterOption === "active" && empleado.activo)
                        || (filterOption === "inactive" && !empleado.activo)) &&
                    (normalizedIdUsuario.includes(normalizedSearchText) ||
                        normalizedNombre.includes(normalizedSearchText) ||
                        normalizedApellido.includes(normalizedSearchText))
                );
            });

            resolve(filteredData);
        });
    };

    //Normaliza el texto para que no importe las Mayus, Minus o Tildes
    const normalizeString = (str: string): string => {
        return str
            .toLowerCase()
            .normalize("NFD") // Eliminar tildes
            .replace(/[\u0300-\u036f]/g, "");
    };

    // Cargar datos de empleados al montar el componente
    useEffect(() => {
        let url = API_URL + "usuario/empleados";

        if (filterOption === "active") {
            url = API_URL + "usuario/empleados/active";
        } else if (filterOption === "inactive") {
            url = API_URL + "usuario/empleados/inactive";
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setEmpleados(data);
            })
            .catch((error) => console.log(error));
    }, [filterOption]);

    const handleEmpleadoAdd = async (empleado: IUsuario) => {
        try {
            // Primero, crear el domicilio
            const domicilio = {
                activo: empleado.domicilio.activo,
                calle: empleado.domicilio.calle,
                numero: empleado.domicilio.numero,
                localidad: empleado.domicilio.localidad,
            };

            const newDomicilio = await handleRequest('POST', `${API_URL}domicilio`, domicilio);

            if (newDomicilio) {
                // Si se crea correctamente el domicilio, entonces agregar el empleado
                const updatedEmpleado = {
                    ...empleado,
                    domicilio: { id: newDomicilio.id, ...domicilio }, // Asociar el ID del domicilio al empleado
                };

                const newEmpleado = await handleRequest('POST', `${API_URL}usuario`, updatedEmpleado);

                if (newEmpleado) {
                    // Si se agrega correctamente el empleado, actualizar la lista de empleados
                    setEmpleados([...empleados, newEmpleado]);
                    console.log('Empleado agregado:', newEmpleado);
                } else {
                    console.log('No se pudo agregar el empleado');
                }
            } else {
                console.log('No se pudo agregar el domicilio');
            }
        } catch (error) {
            console.error('Error al agregar empleado:', error);
        }
    };

    // Manejar la edición de un empleado
    const handleEmpleadoEdit = async (empleado: IEditUsuarioFromAdmin) => {
        try {
            // Verificar si el domicilio existe
            if (empleado.domicilio && empleado.domicilio.id) {
                // Si ya tiene un ID de domicilio, actualizar el existente
                const domicilio = {
                    id: empleado.domicilio.id,
                    activo: empleado.domicilio.activo,
                    calle: empleado.domicilio.calle,
                    numero: empleado.domicilio.numero,
                    localidad: empleado.domicilio.localidad,
                };

                const updatedDomicilio = await handleRequest(
                    'PUT',
                    `${API_URL}domicilio/${empleado.domicilio.id}`,
                    domicilio
                );

                if (updatedDomicilio) {
                    // Actualizar el empleado con el ID del domicilio actualizado
                    const updatedEmpleado = {
                        ...empleado,
                        domicilio: { idPut: updatedDomicilio.id, ...domicilio },
                    };

                    const updatedData = await handleRequest(
                        'PUT',
                        `${API_URL}usuario/${empleado.id}`,
                        updatedEmpleado
                    );

                    if (updatedData) {
                        // Actualizar la lista de empleados con el empleado editado
                        const newData = empleados.map((item) =>
                            item.id === empleado.id ? updatedData : item
                        );
                        setEmpleados(newData);
                        console.log('Empleado editado:', updatedData);
                    } else {
                        console.log('No se pudo editar el empleado');
                    }
                } else {
                    console.log('No se pudo actualizar el domicilio');
                }
            } else {
                console.log('El empleado no tiene información de domicilio para actualizar');
            }
        } catch (error) {
            console.error('Error al editar empleado:', error);
        }
    };


    // Manejar la eliminación de un empleado
    const handleEmpleadoDelete = async (item: IUsuario) => {
        const usuarioId: number = item.id || 0;

        try {
            await handleRequest('DELETE', `${API_URL + "usuario"}/${usuarioId}`);
            setEmpleados(empleados.filter((item) => item.id !== usuarioId));
            console.log("Empleado eliminado correctamente");
        } catch (error) {
            console.log("Error al eliminar empleado:", error);
        }
    };


    // Abrir modal para agregar empleado
    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    // Cerrar modal para agregar empleado
    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    // Obtener detalles de un usuario por su ID
    const usuarioRow = (id: number | undefined) => {
        let i: number = 0;
        let x: boolean = true;
        while (x) {
            if (empleados[i].id === id) {
                let usuarioRe: IEditUsuarioFromAdmin = empleados[i];
                return usuarioRe;
                x = false;
            }
            i = i + 1;
        }
        let usuarioRe: IEditUsuarioFromAdmin = empleados[0];
        return usuarioRe;
    }

    // Abrir modal para editar empleado
    const handleEditModalOpen = (item: IUsuario) => {
        const usuarioSeleccionado = usuarioRow(item.id);
        if (usuarioSeleccionado) {
            setSelectedUsuario(usuarioSeleccionado);
            setEditModalShow(true);
        } else {
            console.error("No se pudo encontrar el usuario seleccionado.");
        }
    };


    // Cerrar modal para editar empleado
    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSelectedUsuario(null);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col sm={3} className="mb-3">
                        <Form.Select
                            value={filterOption}
                            onChange={(e) => setFilterOption(e.target.value)}
                        >
                            <option value="all">Mostrar Todos</option>
                            <option value="active">Mostrar solo Activos</option>
                            <option value="inactive">Mostrar solo Inactivos</option>
                        </Form.Select>
                    </Col>
                    <Col sm={12}>
                        <GenericTable
                            data={empleados}
                            columns={columns}
                            actions={actions}
                            onAdd={handleAddModalOpen}
                            onUpdate={handleEditModalOpen}
                            onDelete={handleEmpleadoDelete}
                            customSearch={customSearch}
                        />
                    </Col>
                </Row>
                <AddEmpleadoModal
                    show={addModalShow}
                    handleClose={handleAddModalClose}
                    handleEmpleadoAdd={handleEmpleadoAdd}
                />

                <EditEmpleadoModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleEmpleadoEdit={handleEmpleadoEdit}
                    selectedEmpleado={selectedUsuario}
                />
            </Container>
        </div>

    );
};

export default Empleados;
