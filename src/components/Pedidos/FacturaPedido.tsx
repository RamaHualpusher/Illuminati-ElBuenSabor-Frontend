import React ,{useEffect, useState}from "react";
import { Link ,useParams} from "react-router-dom";
import { handleRequestSingle } from "../FuncionRequest/FuncionRequest";
import { IPedido } from "../../interface/IPedido";

const FacturaPedido=()=>{
    const { id  } = useParams<{id: string}>();
    const {phat} = useParams<{phat: string}>();
    const [pedido,setPedido]=useState<IPedido>();

    const link=`/${phat}`


    useEffect(() => {
        const fetchData = async () => {
          try {
            const responseData = await handleRequestSingle('GET', `/assets/data/pedidos.json/${id}`);
            setPedido(responseData);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, [id]);



    return(
        <div>
            <div>anda</div>
            <div></div>
            <Link to={link}>Volver</Link>
        </div>
    )
}

export default FacturaPedido;