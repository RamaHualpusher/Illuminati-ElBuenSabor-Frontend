import React ,{useState}from "react";
import Employee from "../Users/Employees/Employee";
import ProductosTable from "../Stock/Producto/ProductosTable";
import IngredientesTable from "../Stock/Ingrediente/IngredientesTable";
import RubrosIngredientesTable from "../Stock/RubroIngrediente/RubroIngredientes";
import RubrosProductosTable from "../Stock/RubroProducto/RubroProducto";
import Bill from "../Bill/Bill";

export default function OpcionesAdmin() {

    const [selectedOption, setSelectedOption] = useState("Null");

    const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectedOption(event.currentTarget.value);
    };

    return (
        <div className="d-flex flex-row bd-highlight mb-3">
        <div className="d-flex flex-column bd-highlight mb-3 bg-secondary p-3"
            style={{ width: "250px", height: "100vh", overflowY: "scroll" }}>
            <div className="row justify-content-start mb-3">
                <div className="col">
                    <button
                        value="employee"//admin/</div>
                        onClick={handleOptionChange}
                        className="card-link"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Empleados
                                </h6>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Clientes
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Ranking Clientes
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Ranking Productos
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Ranking Ventas
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <button
                        value="productos"
                        onClick={handleOptionChange}
                        className="card-link"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Productos
                                </h6>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <button 
                        value="ingredientes" 
                        onClick={handleOptionChange}
                        className="card-link" 
                        style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Ingredientes
                                </h6>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <button 
                        value="rubrosingredientes" 
                        onClick={handleOptionChange}
                        className="card-link" 
                        style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Rubro Ingredientes
                                </h6>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <button
                        value="rubroproductos" 
                        onClick={handleOptionChange}
                        className="card-link" 
                        style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Rubro Productos
                                </h6>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Categorias
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Usuarios
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <button
                        value="facturas" 
                        onClick={handleOptionChange}
                        className="card-link" 
                        style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Facturas
                                </h6>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Stock
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <div>
                {selectedOption==="employee" && <Employee/>}
                {selectedOption==="productos" && <ProductosTable url="/assets/data/productosEjemplo.json"/>}
                {selectedOption==="ingredientes" && <IngredientesTable url="/assets/data/ingredientesEjemplo.json"/>}
                {selectedOption==="rubrosingredientes" && <RubrosIngredientesTable url="/assets/data/dataTableRubrosIngredientes.json"/>}
                {selectedOption==="rubroproductos" && <RubrosProductosTable url="/assets/data/dataTableRubrosProductos.json"/>}
                {selectedOption==="facturas" && <Bill/>}
            </div>
        
        </div>
    )
}
