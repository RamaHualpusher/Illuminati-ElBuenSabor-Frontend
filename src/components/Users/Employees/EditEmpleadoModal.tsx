// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios";
// import { Rol, Empleado } from "../../../interface/interfaces";

// type EditEmpleadoModalProps = {
//   show: boolean;
//   handleClose: () => void;
//   handleEmpleadoEdit: (empleado: Empleado) => void;
//   selectedEmpleado: Empleado | null;
// };

// const EditEmpleadoModal = ({
//   show,
//   handleClose,
//   handleEmpleadoEdit,
//   selectedEmpleado,
// }: EditEmpleadoModalProps) => {
//   const [nombre, setNombre] = useState("");
//   const [apellido, setApellido] = useState("");
//   const [email, setEmail] = useState("");
//   const [estado, setEstado] = useState("");
//   const [rolId, setRolId] = useState<number | null>(null);
//   const [roles, setRoles] = useState<Rol[]>([]);

//   useEffect(() => {
//     axios
//       .get<Rol[]>("/assets/data/idRolEjemplo.json")
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     if (selectedEmpleado) {
//       setNombre(selectedEmpleado.nombre);
//       setApellido(selectedEmpleado.apellido);
//       setEmail(selectedEmpleado.email);
//       setEstado(selectedEmpleado.estado.toString());
//       setRolId(selectedEmpleado.rol?.idRol || null);
//     }
//   }, [selectedEmpleado]);

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (selectedEmpleado) {
//       const selectedRol = roles.find((rol) => rol.idRol === rolId);
//       const updatedEmpleado: Empleado = {
//         id: selectedEmpleado.id,
//         nombre,
//         apellido,
//         email,
//         estado: parseInt(estado),
//         rol: selectedRol || null,
//       };
//       handleEmpleadoEdit(updatedEmpleado);
//     }
//     handleClose();
//   };

//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Editar Empleado</Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Body>
//           <Form.Group className="mb-3" controlId="formNombre">
//             <Form.Label>Nombre</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Ingrese nombre"
//               value={nombre}
//               onChange={(event) => setNombre(event.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formApellido">
//             <Form.Label>Apellido</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Ingrese apellido"
//               value={apellido}
//               onChange={(event) => setApellido(event.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formEmail">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Ingrese email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formEstado">
//             <Form.Label>Estado</Form.Label>
//             <Form.Control type="text"
//               placeholder="Ingrese estado"
//               value={estado}
//               onChange={(event) => setEstado(event.target.value)}
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3" controlId="formRol">
//             <Form.Label>Rol</Form.Label>
//             <Form.Select
//               value={rolId || ""}
//               onChange={(event) => setRolId(parseInt(event.target.value))}
//               required
//             >
//               <option value="">Seleccione un rol</option>
//               {roles.map((rol) => (
//                 <option key={rol.idRol} value={rol.idRol}>
//                   {rol.nombreRol}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Cancelar
//           </Button>
//           <Button variant="primary" type="submit">
//             Guardar Cambios
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default EditEmpleadoModal;
export {};