 import React, { useState, useEffect } from "react";
 import { Table, Dropdown, DropdownButton, InputGroup, FormControl, Button } from 'react-bootstrap';
 import axios from 'axios';
//  import EditEmpleadoModal from './EditEmpleadoModal';
 import AddEmpleadoModal from './AddEmpleadoModal';
 import { Rol,Usuario } from "../../../interface/interfaces";

 export type EmpleadoTableProps = {
   url: string;
 };

 const EmpleadoTable = ({ url }: EmpleadoTableProps) => {
   const [data, setData] = useState<Usuario[]>([]);
   const [editModalShow, setEditModalShow] = useState(false);
   const [addModalShow, setAddModalShow] = useState(false);
   const [selectedEmpleado, setSelectedEmpleado] = useState<Usuario | null>(null);

   useEffect(() => {
     axios.get<Usuario[]>(url)
       .then(response => {
         setData(response.data);
       })
       .catch(error => {
         console.log(error);
       });
   }, [url]);

   const handleEditModalOpen = (empleado: Usuario) => {
     setSelectedEmpleado(empleado);
     setEditModalShow(true);
   }

   const handleEditModalClose = () => {
     setSelectedEmpleado(null);
     setEditModalShow(false);
   }

   const handleAddModalOpen = () => {
     setAddModalShow(true);
   }

   const handleAddModalClose = () => {
     setAddModalShow(false);
   }

   const handleEmpleadoEdit = (empleado: Usuario) => {
     axios.put(`${url}/${empleado.idUsuario}`, empleado)
       .then(response => {
         const newData = [...data];
         const index = newData.findIndex(item => item.idUsuario === empleado.idUsuario);
         newData[index] = response.data;
         setData(newData);
       })
       .catch(error => {
         console.log(error);
       });
   }

   const handleEmpleadoAdd = (empleado: Usuario) => {
     axios.post(url, empleado)
       .then(response => {
         setData([...data, response.data]);
       })
       .catch(error => {
         console.log(error);
       });
   }

   const handleEmpleadoDelete = (empleado: Usuario) => {
     axios.delete(`${url}/${empleado.idUsuario}`)
       .then(response => {
         setData(data.filter(item => item.idUsuario !== empleado.idUsuario));
       })
       .catch(error => {
         console.log(error);
       });
   }

   return (
     <div className="container">
       <div className="row">
         <div className="col-md-4">
           <h3>Lista empleados</h3>
         </div>
         <div className="col-md-4">
           <InputGroup>
             <FormControl type="text" placeholder="Buscar empleado" />
             <Button variant="outline-secondary">
               <i className="bi bi-search"></i>
             </Button>
           </InputGroup>
         </div>
         <div className="col-md-4">
           <div className="d-flex align-items-center">
             <DropdownButton id="dropdown-basic-button" title="Filtrar">
               <Dropdown.Item href="#">Filtro 1</Dropdown.Item>
               <Dropdown.Item href="#">Filtro 2</Dropdown.Item>
               <Dropdown.Item href="#">Filtro 3</Dropdown.Item>
             </DropdownButton>
             <Button variant="primary" className="ms-2" onClick={handleAddModalOpen}>
               Añadir empleado
               <i className="bi bi-person-add fs-5"></i>
             </Button>
           </div>
         </div>
       </div>
       <Table striped bordered hover>
         <thead>
           <tr>
             <th>NOMBRE</th>
             <th>APELLIDO</th>
             <th>EMAIL</th>
             <th>ROL</th>
             {/* <th>ESTADO</th> */}
           </tr>
         </thead>
         <tbody>
           {data.map(empleado => (
             <tr key={empleado.idUsuario}>
               <td>{empleado.nombre}</td>
               <td>{empleado.apellido}</td>
               <td>{empleado.email}</td>
               <td>{empleado.Rol ? empleado.Rol.nombreRol : "-"}</td>
               {/* <td>{empleado.estado.toString()}</td> */}
               <td>
                 <Button variant="primary" onClick={() => handleEditModalOpen(empleado)}>Editar</Button>
               </td>
               <td>
                 <Button variant="danger" onClick={() => handleEmpleadoDelete(empleado)}>Eliminar</Button>
               </td>
             </tr>
           ))}
         </tbody>
       </Table>

       {/* <EditEmpleadoModal
         show={editModalShow}
         handleClose={handleEditModalClose}
         handleEmpleadoEdit={handleEmpleadoEdit}
         selectedEmpleado={selectedEmpleado}
       /> */}
       <AddEmpleadoModal
         show={addModalShow}
         handleClose={handleAddModalClose}
         handleEmpleadoAdd={handleEmpleadoAdd}
       />
     </div>
   );
 };

 export default EmpleadoTable;
export {};