import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Producto } from "../../../interface/Producto";
import { Rubro } from "../../../interface/Rubro";
import { AddProductoModalProps } from "../../../interface/Producto";
import { Ingredientes } from "../../../interface/Ingredientes";
import { ProductoIngrediente } from "../../../interface/ProductoIngrediente";
const AddProductoModal: React.FC<AddProductoModalProps> = ({
  show,
  handleClose,
  handleProductoAdd,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState("");
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [tiempo, setTiempo] = useState(0);
  const [denominacion, setDenominacion] = useState("");
  const [preparacion, setPreparacion] = useState("");
  const [imagen, setImagen] = useState("");
  const [precio, setPrecio] = useState(0);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [estado, setEstado] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ingredientes, setIngredientes] = useState<ProductoIngrediente[] | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [ingredientesA, setIngredientesA] = useState<Ingredientes[]>([]);
  const [cantIngrediente, setCantIngrediente] = useState<number>(0);
  const [ingredienteA, setIngredienteA] = useState<Ingredientes | null>(null);
  const [costo, setCosto] = useState<number>(0);

  // Definición de objetos por defecto
  const rubrod: Rubro = {
    idRubro: 0,
    nombre: "",
  };

  const defectoIngrediente: Ingredientes = {
    estado: false,
    idIngredientes: 0,
    nombre: "none",
    precioCosto: 0,
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
    ProductoIngrediente: [],
  }

  const defectoProductoIngrediente: ProductoIngrediente = {
    cantidad: 0,
    idProductoIngrediente: 0,
    Ingredientes: defectoIngrediente
  }

  const [ingrediente, setIngrediente] = useState<ProductoIngrediente>(defectoProductoIngrediente);
  const [selectedProducto, setSelectedProducto] = useState<Producto>(defectoProducto);

  // Cargar rubros y productos al montar el componente
  useEffect(() => {
    axios
      .get<Rubro[]>("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => {
        setRubros(response.data);
        if (selectedProducto) {
          setIngredientes(selectedProducto.ProductoIngrediente || [])
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
    fetch("/assets/data/ingredientesEjemplo.json")
      .then((response) => response.json())
      .then((data: Ingredientes[]) => {
        setIngredientesA(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Función para seleccionar un ingrediente existente
  const selectIngrediente = (nombre: string) => {
    if (ingrediente !== defectoProductoIngrediente) {
      ingredientes?.map((ingr) => {
        if (ingrediente.Ingredientes.nombre === ingr.Ingredientes.nombre) {
          console.log("ingrediente previo guardado")
          ingr = ingrediente;
          ingr.cantidad = cantidad;
        }
      })
    }
    console.log("ingreso a funcion")
    if (nombre !== "none") {
      ingredientes?.map((ingr) => {
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

  // Manejar cambio en la cantidad de un ingrediente
  const handleCantidad = (cant: number) => {
    if (cant > cantidad) {
      setCosto(costo + ((cant - cantidad) * ingrediente.Ingredientes.precioCosto))
    } else {
      setCosto(costo - ((cantidad - cant) * ingrediente.Ingredientes.precioCosto))
    }
    setCantidad(cant);
    if (ingrediente !== defectoProductoIngrediente) {
      selectedProducto?.ProductoIngrediente?.map((ingr) => {
        if (ingrediente.Ingredientes.nombre === ingr.Ingredientes.nombre) {
          console.log("ingrediente previo guardado")
          ingr = ingrediente;
          ingr.cantidad = cantidad;
        }
      })
    }
  }

  // Eliminar un ingrediente seleccionado
  const handleDeletIngrediente = () => {
    if (ingredientes) {
      console.log("ingreso a funcion")
      const filtrar = ingredientes;
      if (nombre !== "none") {
        const filtrado = filtrar?.filter(filtrar => filtrar.Ingredientes.nombre !== ingrediente.Ingredientes.nombre);
        setIngredientes(filtrado);
        setCosto(costo - ingrediente.Ingredientes.precioCosto * ingrediente.cantidad);
        setIngrediente(defectoProductoIngrediente);
        setCantidad(0);
      }
    }
    else {
      return null;
    }
  }

  // Función para seleccionar un ingrediente a agregar
  const selectIngredienteA = (nombre: string) => {
    console.log("ingreso a funcion")
    if (nombre !== "none") {
      ingredientesA?.map((ingr) => {
        if (nombre === ingr.nombre) {
          console.log("ingrediente encontrado" + ingr.nombre);
          setIngredienteA(ingr);
          return null;
        }
      })
      return null;
    }
    else {
      setIngredienteA(null)
      return null;
    }
  }

  // Agregar un ingrediente a la lista de ingredientes del producto
  const agregarIngrediente = () => {
    if (ingredienteA !== null && cantIngrediente > 0) {
      let contar: number = 0;
      ingredientes?.map((ingre) => {
        contar = ingre.idProductoIngrediente;
      })
      let encontrado = false
      ingredientes?.map((ingre) => {
        if (ingre.Ingredientes.nombre === ingredienteA.nombre) {
          console.log("coincidencia encontrada " + ingre.Ingredientes.nombre + " cantida previa" + (ingre.cantidad))
          ingre.cantidad += cantIngrediente;
          setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
          console.log(ingre.cantidad);
          setCantIngrediente(0);
          encontrado = true;
        }
      })

      if (encontrado === false) {
        const ingre: Ingredientes | null = ingredienteA;
        const ingres: ProductoIngrediente[] | null = ingredientes;
        const agre: ProductoIngrediente = {
          cantidad: cantIngrediente,
          idProductoIngrediente: contar + 1,
          Ingredientes: ingre || defectoIngrediente
        }
        setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
        ingres?.push(agre);
        setIngredientes(ingres);
        console.log("agregado ingrediente")
        setCantIngrediente(0);
      }
    }
  }

  // Manejar el envío del formulario de agregar producto
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ingredientes && ingredientes.length > 0) {
      const newProducto: Producto = {
        idProducto: 0,
        nombre,
        Rubro: { idRubro: rubroId || 0, nombre: "" },
        tiempoEstimadoCocina: tiempo,
        denominacion: "",
        imagen,
        stockActual: 0,
        stockMinimo: 0,
        preparacion: "",
        precio,
        esBebida: false,
        estado,

        ProductoIngrediente: selectedProducto.ProductoIngrediente,
      };
      handleProductoAdd(newProducto);
      handleClose();
    }
  };

  const handleCancelar = () => {
    setCantIngrediente(0);
    setCantidad(0);
    setEstado(true);
    setImagen("");
    setIngrediente(defectoProductoIngrediente);
    setIngredienteA(defectoIngrediente);
    setIngredientes(null);
    setNombre("");
    setPrecio(0);
    setProductos([]);
    setRubroId(0);
    setSelectedProducto(defectoProducto);
    setTiempo(0);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      {/* Estructura del modal */}
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese un nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formImagen">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese URL de la imagen"
              value={imagen}
              onChange={(event) => setImagen(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDenominacion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese una descripción"
              value={denominacion}
              onChange={(event) => setDenominacion(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPreparacion">
            <Form.Label>Receta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese una receta"
              value={preparacion}
              onChange={(event) => setPreparacion(event.target.value)}
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
                <option key={rubro.idRubro}
                  value={rubro.idRubro}
                  disabled={!rubro.estado}>
                  {rubro.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTiempo">
            <Form.Label>Tiempo en cocina</Form.Label>
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
              {selectedProducto?.ProductoIngrediente?.map((Ingrediente) =>
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
              variant="danger" onClick={() => handleDeletIngrediente()}>Eliminar Ingrediente</Button>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formModIngrediente">
            <Form.Label>Agregar Ingredientes</Form.Label>
            <Form.Select
              value={ingredienteA?.nombre}
              onChange={(event) => selectIngredienteA(event.target.value)}
              required
            >
              <option value="none">Agregar Ingrediente</option>
              {ingredientesA.map((Ingrediente) =>
                <option value={Ingrediente.nombre}>{Ingrediente.nombre}</option>
              )}
            </Form.Select>
            <Form.Control
              type="number"
              placeholder="Ingrese Cantidad"
              value={cantIngrediente}
              onChange={(event) => setCantIngrediente(parseInt(event.target.value))}
              required
            >
            </Form.Control>
            <Button
              variant="success" onClick={() => agregarIngrediente()}>Eliminar Ingrediente</Button>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelar}>
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