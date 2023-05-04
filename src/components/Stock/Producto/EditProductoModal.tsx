import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "./ProductosTable";

type EditProductoModalProps = {
show: boolean;
handleClose: () => void;
handleProductoEdit: (producto: Producto) => void;
selectedProducto: Producto | null;
};

const EditProductoModal = ({
show,
handleClose,
handleProductoEdit,
selectedProducto,
}: EditProductoModalProps) => {
const [nombre, setNombre] = useState(selectedProducto?.nombre || "");
const [rubro, setRubro] = useState(selectedProducto?.rubro || "");
const [tiempo, setTiempo] = useState(selectedProducto?.tiempo || 0);
const [precio, setPrecio] = useState(selectedProducto?.precio || 0);

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
if (selectedProducto) {
const updatedProducto: Producto = {
id: selectedProducto.id,
nombre,
rubro,
tiempo,
precio,
};
handleProductoEdit(updatedProducto);
}
handleClose();
};

return (
<Modal show={show} onHide={handleClose}>
<Modal.Header closeButton>
<Modal.Title>Editar Producto</Modal.Title>
</Modal.Header>
<Form onSubmit={handleSubmit}>
<Modal.Body>
<Form.Group className="mb-3" controlId="formNombre">
<Form.Label>Nombre</Form.Label>
<Form.Control
type="text"
placeholder="Ingrese nombre"
value={nombre}
onChange={(event) => setNombre(event.target.value)}
required
/>
</Form.Group>
<Form.Group className="mb-3" controlId="formRubro">
<Form.Label>Rubro</Form.Label>
<Form.Control
type="text"
placeholder="Ingrese rubro"
value={rubro}
onChange={(event) => setRubro(event.target.value)}
required
/>
</Form.Group>
<Form.Group className="mb-3" controlId="formTiempo">
<Form.Label>Tiempo (min)</Form.Label>
<Form.Control
type="number"
placeholder="Ingrese tiempo en minutos"
value={tiempo}
onChange={(event) => setTiempo(parseInt(event.target.value))}
required
/>
</Form.Group>
<Form.Group className="mb-3" controlId="formPrecio">
<Form.Label>Precio</Form.Label>
<Form.Control
type="number"
placeholder="Ingrese precio"
value={precio}
onChange={(event) => setPrecio(parseFloat(event.target.value))}
required
/>
</Form.Group>
</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={handleClose}>
Cancelar
</Button>
<Button variant="primary" type="submit">
Guardar Cambios
</Button>
</Modal.Footer>
</Form>
</Modal>
);
};

export default EditProductoModal;