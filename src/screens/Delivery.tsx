import React from "react";
import NavBar from "../components/NavBar/AdminBar";
import DeliveryPage from "../components/DeliveryPage/DeliveryPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";


const Delivery = () =>{
    return(
        <div>
            <NavBar/>
            <PanelAdmin title={"Delivery"}/>
            <DeliveryPage/>
        </div>
    );
};
export default Delivery;