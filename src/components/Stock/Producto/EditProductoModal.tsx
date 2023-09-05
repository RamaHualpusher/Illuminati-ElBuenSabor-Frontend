import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "../../../interface/Producto";
import { Rubro } from "../../../interface/Rubro";
import { EditProductoModalProps } from "../../../interface/Producto";
import { Ingredientes } from "../../../interface/Ingredientes";
import { ProductoIngrediente } from "../../../interface/ProductoIngrediente";

const EditProductoModal: React.FC<EditProductoModalProps> = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState("");
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [tiempo, setTiempo] = useState(0);
  const [imagen, setImagen] = useState("");
  const [precio, setPrecio] = useState(0);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<Rubro | null>(null);
  const [estado, setEstado] = useState(selectedProducto?.estado || false);
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
  const [ingrediente, setIngrediente] = useState<ProductoIngrediente>(defectoProductoIngrediente);

  // Cargar rubros y productos al montar el componente
  useEffect(() => {
    fetch("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => response.json())
      .then((data: Rubro[]) => {
        setRubros(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Cargar ingredientes al montar el componente
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

  // Cargar datos del producto seleccionado al montar el componente
  useEffect(() => {
    if (selectedProducto) {
      setNombre(selectedProducto?.nombre || "");
      setImagen(selectedProducto?.imagen || "");
      setRubroId(selectedProducto?.Rubro?.idRubro || null);
      setSelectedRubro(selectedProducto?.Rubro || null);
      setTiempo(selectedProducto?.tiempoEstimadoCocina || 0);
      setPrecio(selectedProducto?.precio || 0);
      setEstado(selectedProducto?.estado || false);
      setIngredientes(selectedProducto.ProductoIngrediente)
      let cos = 0;
      ingredientes?.map((ingre) => {
        console.log(cos);
        cos += (ingre.Ingredientes.precioCosto * ingre.cantidad);
      })
      setCosto(cos);
    }
  }, [selectedProducto]);

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
      setIngrediente(defectoProductoIngrediente);
      setCantidad(0);
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

  // Función para agregar un ingrediente a la lista de ingredientes
  const agregarIngrediente = () => {
    if (ingredienteA !== null && cantIngrediente > 0) {
      let contar: number = 0;
      ingredientes?.map((ingre) => {
        contar = ingre.idProductoIngrediente;
      })
      let encontrado = false
      ingredientes?.map((ingre) => {
        if (ingre.Ingredientes.nombre === ingredienteA.nombre && ingre.Ingredientes.estado !== false) {
          console.log("coincidencia encontrada " + ingre.Ingredientes.nombre + " cantida previa" + (ingre.cantidad))
          ingre.cantidad += cantIngrediente;
          setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
          console.log(ingre.cantidad);
          setCantIngrediente(0);
          encontrado = true;
        }
      })

      if (encontrado === false && ingredienteA.estado !== false) {
        const ingre: Ingredientes | null = ingredienteA;
        const ingres: ProductoIngrediente[] | null = ingredientes;
        const agre: ProductoIngrediente = {
          cantidad: cantIngrediente,
          idProductoIngrediente: contar + 1,
          Ingredientes: ingre || defectoIngrediente,
          Producto: defectoProducto
        }
        setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
        ingres?.push(agre);
        setIngredientes(ingres);
        console.log("agregado ingrediente")
        setCantIngrediente(0);
      }
    }
  }

  // Función para manejar cambios en la cantidad de un ingrediente
  const handleCantidad = (cant: number) => {
    if (cant > cantidad) {
      setCosto(costo + ((cant - cantidad) * ingrediente.Ingredientes.precioCosto))
    } else {
      setCosto(costo - ((cantidad - cant) * ingrediente.Ingredientes.precioCosto))
    }
    setCantidad(cant);
    if (ingrediente !== defectoProductoIngrediente) {
      ingredientes?.map((ingr) => {
        if (ingrediente.Ingredientes.nombre === ingr.Ingredientes.nombre) {
          console.log("ingrediente previo guardado")
          ingr = ingrediente;
          ingr.cantidad = cantidad;

        }
      })
    }
  }

  // Función para eliminar un ingrediente seleccionado
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

  // Manejar el envío del formulario de edición
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ingredientes && ingredientes.length > 0) {
      if (selectedProducto) {
        const updatedProducto: Producto = {
          ...selectedProducto,
          nombre,
          tiempoEstimadoCocina: tiempo,
          precio: precio,
          imagen,
          estado,
          Rubro: selectedRubro || selectedProducto.Rubro,
          ProductoIngrediente: ingredientes || selectedProducto.ProductoIngrediente,
        };

        handleProductoEdit(updatedProducto);
      }
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      {/* Estructura del modal */}
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
            <Form.Label>{"Precio (costo: " + costo + ") "}</Form.Label>
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
              {ingredientes?.map((Ingrediente) =>
                <option value={Ingrediente.Ingredientes.nombre}>{Ingrediente.Ingredientes.nombre + " (" + Ingrediente.Ingredientes.unidadMedida + ")"}</option>
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
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Ingredientes</Form.Label>
            <Form.Select
              value={ingredienteA?.nombre}
              onChange={(event) => selectIngredienteA(event.target.value)}
              required
            >
              <option value="none">Agregar Ingrediente</option>
              {ingredientesA.map((Ingrediente) =>
                <option value={Ingrediente.nombre}>{Ingrediente.nombre + " (" + Ingrediente.unidadMedida + ") " + (Ingrediente.estado === false ? "Baja" : "")}</option>
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
              variant={ingredienteA?.estado === false ? "secondary" : "success"} onClick={() => agregarIngrediente()}>Agregar Ingrediente</Button>
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
