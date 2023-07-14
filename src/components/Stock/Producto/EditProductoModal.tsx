import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "../../../interface/Producto";
import { Rubro } from "../../../interface/Rubro";
import { EditProductoModalProps } from "../../../interface/Producto";
import Ingrediente from "../Ingrediente/Ingrediente";
import { Ingredientes } from "../../../interface/Ingredientes";
import { ProductoIngrediente } from "../../../interface/ProductoIngrediente";

const EditProductoModal: React.FC<EditProductoModalProps> = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
}) => {


  const rubrod:Rubro={
    idRubro:0,
    nombre:"",
  };


  const defectoIngrediente:Ingredientes={
    estado:false,
    idIngredientes:0,
    nombre:"none",
    precioCosto:0,
    ProductoIngrediente:[],
    Rubro:rubrod,
    stockActual:0,
    stockMinimo:0,
    unidadMedida:""
  };

  const defectoProducto:Producto={
    idProducto: 0,
      nombre:"",
      Rubro: rubrod,
      tiempoEstimadoCocina:0,
      denominacion: "",
      imagen: "",
      stockActual: 0,
      stockMinimo: 0,
      preparacion: "",
      precio:0,
      esBebida: false,
      estado:false,
      DetallePedido: [],
      ProductoIngrediente: [],
  }

  const defectoProductoIngrediente:ProductoIngrediente={
    cantidad:0,
    idProductoIngrediente:0,
    Ingredientes:defectoIngrediente,
    Producto:defectoProducto
  }


  const [nombre, setNombre] = useState("");
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [tiempo, setTiempo] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<Rubro | null>(null);
  const [estado, setEstado] = useState(selectedProducto?.estado || false);
  const [ingredientes, setIngredientes]=useState<ProductoIngrediente[]|null>(null);
  const [ingrediente,setIngrediente]=useState<ProductoIngrediente>(defectoProductoIngrediente);
  const [cantidad,setCantidad]=useState(0);






  

  useEffect(() => {
    fetch("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => response.json())
      .then((data: Rubro[]) => {
        setRubros(data);
        if(selectedProducto){
        setIngredientes(selectedProducto.ProductoIngrediente)}
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedProducto) {
      setNombre(selectedProducto?.nombre || "");
      setRubroId(selectedProducto?.Rubro?.idRubro || null);
      setSelectedRubro(selectedProducto?.Rubro || null);
      setTiempo(selectedProducto?.tiempoEstimadoCocina || 0);
      setPrecio(selectedProducto?.precio || 0);
      setEstado(selectedProducto?.estado || false);
    }
  }, [selectedProducto]);


  const selectIngrediente=(nombre:string)=>{

    if(ingrediente!==defectoProductoIngrediente){
      selectedProducto?.ProductoIngrediente.map((ingr)=>{
        if(ingrediente.Ingredientes.nombre===ingr.Ingredientes.nombre){
          console.log("ingrediente previo guardado")
          ingr=ingrediente;
          ingr.cantidad=cantidad;
          
        }
      })
    }
    console.log("ingreso a funcion")
    if(nombre!=="none"){
    selectedProducto?.ProductoIngrediente.map((ingr)=>{
      if(nombre===ingr.Ingredientes.nombre){
        console.log("ingrediente encontrado"+ingr.Ingredientes.nombre)
        setCantidad(ingr.cantidad);
        setIngrediente(ingr);
        return null;
      }
    })
    return null;}
    else{
      return null;
    }
  }

  const handleCantidad=(cant:number)=>{
    setCantidad(cant);
    if(ingrediente!==defectoProductoIngrediente){
      selectedProducto?.ProductoIngrediente.map((ingr)=>{
        if(ingrediente.Ingredientes.nombre===ingr.Ingredientes.nombre){
          console.log("ingrediente previo guardado")
          ingr=ingrediente;
          ingr.cantidad=cantidad;
          
        }
      })
    }
  }

  const handleDeletIngrediente=()=>{
    if(selectedProducto){
    console.log("ingreso a funcion")
    const filtrar=selectedProducto?.ProductoIngrediente;
    if(nombre!=="none"){
      const filtrado=filtrar?.filter(filtrar=>filtrar.Ingredientes.nombre !==ingrediente.Ingredientes.nombre);
      selectedProducto.ProductoIngrediente=filtrado;
      setIngrediente(defectoProductoIngrediente);
      setCantidad(0);
    }}
    else{
      return null;
    }
  }




  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedProducto) {
      const updatedProducto: Producto = {
        ...selectedProducto,
        nombre,
        tiempoEstimadoCocina: tiempo,
        precio: precio,
        estado,
        Rubro: selectedRubro || selectedProducto.Rubro,
        ProductoIngrediente:selectedProducto.ProductoIngrediente,
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
            <Form.Select
              value={selectedRubro?.idRubro || ""}
              onChange={(event) => {
                const rubroId = parseInt(event.target.value);
                const rubro = rubros.find((rubro) => rubro.idRubro === rubroId);
                setRubroId(rubroId);
                setSelectedRubro(rubro || null);
              }}
              required
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
                  {rubro.nombre}
                </option>
              ))}
            </Form.Select>
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
              placeholder="Ingrese el precio"
              value={precio}
              onChange={(event) => setPrecio(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={estado ? 'alta' : 'baja'}
              onChange={(event) => setEstado(event.target.value === 'alta')}
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Ingredientes</Form.Label>
            <Form.Select
              value={ingrediente?.Ingredientes.nombre}
              onChange={(event) => selectIngrediente(event.target.value)}
              required
            >
              <option value="none">Eliminar Ingrediente</option>
              {selectedProducto?.ProductoIngrediente.map((Ingrediente)=>
              <option value={Ingrediente.Ingredientes.nombre}>{Ingrediente.Ingredientes.nombre}</option>
              )}
            </Form.Select>
            <Form.Control
            type="number"
            placeholder="Ingrese Cantidad"
            value={cantidad}
            onChange={(event) => handleCantidad(parseInt(event.target.value))}
            required
            >  
            </Form.Control>
            <Button
            variant="secondary" onClick={()=>handleDeletIngrediente()}>Eliminar Ingrediente</Button>
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
