import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Producto } from "../../../interface/Producto";
import { Rubro } from "../../../interface/Rubro";
import { AddProductoModalProps } from "../../../interface/Producto";
import Ingrediente from "../Ingrediente/Ingrediente";
import { Ingredientes } from "../../../interface/Ingredientes";
import { ProductoIngrediente } from "../../../interface/ProductoIngrediente";

const AddProductoModal: React.FC<AddProductoModalProps> = ({
  show,
  handleClose,
  handleProductoAdd,
}) => {




  const rubrod: Rubro = {
    idRubro: 0,
    nombre: "",
  };


  const defectoIngrediente: Ingredientes = {
    estado: false,
    idIngredientes: 0,
    nombre: "none",
    precioCosto: 0,
    ProductoIngrediente: [],
    Rubro: rubrod,
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: ""
  };

  const defectoProducto: Producto = {
    idProducto: 0,
    nombre: "",
    Rubro: rubrod,
    tiempoEstimadoCocina: 0,
    denominacion: "",
    imagen: "",
    stockActual: 0,
    stockMinimo: 0,
    preparacion: "",
    precio: 0,
    esBebida: false,
    estado: false,
    DetallePedido: [],
    ProductoIngrediente: [],
  }

  const defectoProductoIngrediente: ProductoIngrediente = {
    cantidad: 0,
    idProductoIngrediente: 0,
    Ingredientes: defectoIngrediente,
    Producto: defectoProducto
  }

  const [selectedProducto,setSelectedProducto]= useState<Producto>(defectoProducto);
  const [nombre, setNombre] = useState("");
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [tiempo, setTiempo] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [estado, setEstado] = useState(true); // Estado por defecto: Alta
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ingredientes, setIngredientes] = useState<ProductoIngrediente[] | null>(null);
  const [ingrediente, setIngrediente] = useState<ProductoIngrediente>(defectoProductoIngrediente);
  const [cantidad, setCantidad] = useState(0);
  const [ingredientesA,setIngredientesA]=useState<Ingredientes[]>([]);
  const [cantIngrediente,setCantIngrediente]=useState<number>(0);
  const [ingredienteA,setIngredienteA]=useState<Ingredientes| null>(null);

  useEffect(() => {
    axios
      .get<Rubro[]>("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => {
        setRubros(response.data);
        if (selectedProducto) {
          setIngredientes(selectedProducto.ProductoIngrediente)
        }
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/assets/data/productosLanding.json")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetch("/assets/data/ingredientesEjemplo.json")
      .then((response) => response.json())
      .then((data: Ingredientes[]) => {
        setIngredientesA(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);






  const selectIngrediente = (nombre: string) => {

    if (ingrediente !== defectoProductoIngrediente) {
      selectedProducto?.ProductoIngrediente.map((ingr) => {
        if (ingrediente.Ingredientes.nombre === ingr.Ingredientes.nombre) {
          console.log("ingrediente previo guardado")
          ingr = ingrediente;
          ingr.cantidad = cantidad;

        }
      })
    }
    console.log("ingreso a funcion")
    if (nombre !== "none") {
      selectedProducto?.ProductoIngrediente.map((ingr) => {
        if (nombre === ingr.Ingredientes.nombre) {
          console.log("ingrediente encontrado" + ingr.Ingredientes.nombre)
          setCantidad(ingr.cantidad);
          setIngrediente(ingr);
          return null;
        }
      })
      return null;
    }
    else {
      return null;
    }
  }

  const handleCantidad = (cant: number) => {
    setCantidad(cant);
    if (ingrediente !== defectoProductoIngrediente) {
      selectedProducto?.ProductoIngrediente.map((ingr) => {
        if (ingrediente.Ingredientes.nombre === ingr.Ingredientes.nombre) {
          console.log("ingrediente previo guardado")
          ingr = ingrediente;
          ingr.cantidad = cantidad;

        }
      })
    }
  }

  const handleDeletIngrediente = () => {
    if (selectedProducto) {
      console.log("ingreso a funcion")
      const filtrar = selectedProducto?.ProductoIngrediente;
      if (nombre !== "none") {
        const filtrado = filtrar?.filter(filtrar => filtrar.Ingredientes.nombre !== ingrediente.Ingredientes.nombre);
        selectedProducto.ProductoIngrediente = filtrado;
        setIngrediente(defectoProductoIngrediente);
        setCantidad(0);
      }
    }
    else {
      return null;
    }
  }

  const selectIngredienteA=(nombre:string)=>{

    
    console.log("ingreso a funcion")
    if(nombre!=="none"){
    ingredientesA?.map((ingr)=>{
      if(nombre===ingr.nombre){
        console.log("ingrediente encontrado"+ingr.nombre);
        setIngredienteA(ingr);
        return null;
      }
    })
    return null;}
    else{
      setIngredienteA(null)
      return null;
    }
  }


  const agregarIngrediente=()=>{
    if(ingredienteA!==null && cantIngrediente>0){
      let contar:number=0;
      ingredientes?.map((ingre)=>{
        contar=ingre.idProductoIngrediente;
      })
      let encontrado=false
      ingredientes?.map((ingre)=>{
        if(ingre.Ingredientes.nombre===ingredienteA.nombre){
          console.log("coincidencia encontrada "+ingre.Ingredientes.nombre+" cantida previa"+(ingre.cantidad))
          ingre.cantidad+=cantIngrediente;
          console.log(ingre.cantidad);
          setCantIngrediente(0);
          encontrado=true;
        }
      })

      if(encontrado===false)
      {const ingre:Ingredientes|null=ingredienteA;
      const ingres:ProductoIngrediente[]|null=ingredientes;
      const agre:ProductoIngrediente={
        cantidad:cantIngrediente,
        idProductoIngrediente:contar+1,
        Ingredientes:ingre||defectoIngrediente,
        Producto:defectoProducto
      }
      ingres?.push(agre);
      setIngredientes(ingres);
      console.log("agregado ingrediente")
      setCantIngrediente(0);
      }
    }
  }





  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProducto: Producto = {
      idProducto: 0,
      nombre,
      Rubro: { idRubro: rubroId || 0, nombre: "" },
      tiempoEstimadoCocina: tiempo,
      denominacion: "",
      imagen: "",
      stockActual: 0,
      stockMinimo: 0,
      preparacion: "",
      precio,
      esBebida: false,
      estado,
      DetallePedido: [],

      ProductoIngrediente: selectedProducto.ProductoIngrediente,
    };
    handleProductoAdd(newProducto);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
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
              onChange={(event) => setRubroId(parseInt(event.target.value))}
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
            <Form.Label>Tiempo</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese tiempo"
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
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={estado ? 'alta' : 'baja'}
              onChange={(event) =>
                setEstado(event.target.value === 'alta' ? true : false)
              }
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModIngrediente">
            <Form.Label>Modificar Ingredientes</Form.Label>
            <Form.Select
              value={ingrediente?.Ingredientes.nombre}
              onChange={(event) => selectIngrediente(event.target.value)}
              required
            >
              <option value="none">Eliminar Ingrediente</option>
              {selectedProducto?.ProductoIngrediente.map((Ingrediente) =>
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
              variant="secondary" onClick={() => handleDeletIngrediente()}>Eliminar Ingrediente</Button>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModIngrediente">
            <Form.Label>Agregar Ingredientes</Form.Label>
            <Form.Select
              value={ingrediente?.Ingredientes.nombre}
              onChange={(event) => selectIngrediente(event.target.value)}
              required
            >
              <option value="none">Agregar Ingrediente</option>
              {selectedProducto?.ProductoIngrediente.map((Ingrediente) =>
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
              variant="secondary" onClick={() => handleDeletIngrediente()}>Eliminar Ingrediente</Button>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProductoModal;
