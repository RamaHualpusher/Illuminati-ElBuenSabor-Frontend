import { CartItem } from "./CartProvider";
import AdminBar
 from "../NavBar/AdminBar";
interface ConfirmacionPedidoProps {
    cartItems: CartItem[];
    metodoPago: string;
    tipoEnvio: string;
    setMetodoPago: (metodo: string) => void;
    setTipoEnvio: (tipo: string) => void;
    modificarCantidad: (id: number, cantidad: number) => void;
    eliminarDetallePedido: (id: number) => void;
    onCancel: () => void;
    onContinue: () => void;
}


  
const ConfirmacionPedido: React.FC<ConfirmacionPedidoProps> = ({ cartItems, metodoPago, tipoEnvio, setMetodoPago, setTipoEnvio, modificarCantidad, eliminarDetallePedido, onCancel, onContinue }) => {
    const handleMetodoPago = (metodo: string) => {
        setMetodoPago(metodo);
      }
    
      const handleTipoEnvio = (tipo: string) => {
        setTipoEnvio(tipo);
      }
      
  return (
    <div style={{marginTop: "5rem"}}>
      <AdminBar />
      <h2>Confirmación de Pedido</h2>
      <form>
          <div className="container">
              {cartItems.map((item) => (
              <div className="d-flex align-items-start w-100" key={item.id}>
                  <div>
                  <img src={item.image} alt={item.name} className="img-fluid rounded-circle me-2" style={{width: "50px", height: "50px"}}/>
                  </div>
                  <div className="flex-grow-1">
                  <div className='d-flex justify-content-between align-items-center'>
                      <h3 className="h5 flex-grow-1">{item.name}</h3>
                      <p>${item.price * item.quantity}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                      <div>
                      <button className="btn btn-sm btn-outline-secondary mx-1" onClick={(e) => {
                        e.preventDefault(); 
                        modificarCantidad(item.id, item.quantity - 1);
                        }}>
                            -
                        </button>
                      <button className="btn btn-sm btn-outline-secondary mx-1 px-3 p-2" disabled>
                          <span className="h6 ">{item.quantity}</span>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary mx-1" onClick={(e) => {
                        e.preventDefault(); 
                        modificarCantidad(item.id, item.quantity + 1);
                        }}>
                            +
                        </button>
                      </div>
                      <button className="btn btn-sm btn-outline-danger" onClick={(e) =>{ 
                        e.preventDefault();
                        eliminarDetallePedido(item.id)}}>
                      <i className="bi bi-trash"></i>
                      </button>
                  </div>
                  </div>
              </div>
              ))}
          </div>
        <div className="container">
        <h3>Metodo de Pago</h3>
          <div className="mb-3">
            <input 
              type="radio" 
              className="btn-check" 
              id="efectivo-outlined" 
              autoComplete="off" 
              checked={metodoPago === "Efectivo"}
              onChange={() => handleMetodoPago("Efectivo")}
            />
            <label className="btn btn-outline-primary" htmlFor="efectivo-outlined">Efectivo</label>

            <input 
              type="radio" 
              className="btn-check" 
              id="mercadoPago-outlined" 
              autoComplete="off"
              checked={metodoPago === "Mercado Pago"}
              onChange={() => handleMetodoPago("Mercado Pago")}
            />
            <label className="btn btn-outline-primary" htmlFor="mercadoPago-outlined">Mercado Pago</label>
          </div>

          <h3>Tipo de Envío</h3>
          <div className="mb-3">
            <input 
              type="radio" 
              className="btn-check" 
              id="delivery-outlined" 
              autoComplete="off" 
              checked={tipoEnvio === "Delivery"}
              onChange={() => handleTipoEnvio("Delivery")}
            />
            <label className="btn btn-outline-success" htmlFor="delivery-outlined">Delivery</label>

            <input 
              type="radio" 
              className="btn-check" 
              id="retiroLocal-outlined" 
              autoComplete="off"
              checked={tipoEnvio === "Retiro en el Local"}
              onChange={() => handleTipoEnvio("Retiro en el Local")}
            />
            <label className="btn btn-outline-success" htmlFor="retiroLocal-outlined">Retiro en el Local</label>
          </div>

        <button 
        type="submit"
        className="btn btn-primary me-2"
        >
            Confirmar Pedido
        </button>
        <button 
        type="button" 
        className="btn btn-secondary me-2" 
        onClick={onContinue}
      >
        Seguir Agregando Productos
      </button>
      <button 
        type="button" 
        className="btn btn-danger" 
        onClick={onCancel}
      >
        Cancelar
      </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmacionPedido;
