import React from "react";

const DondeEstamos = () => {
    return (
        <div
            className="d-flex align-items-center flex-column"
            style={{
                minHeight: "100vh",
                backgroundImage: `url('/assets/img/fondoUbicaciones.png')`,
                backgroundSize: "cover",
            }}
        >
            {/* Encabezado */}
            <h1 className="display-4 mt-5 text-white">Donde Estamos</h1>

            {/* Mapa de ubicación */}
            <div className="w-100" style={{ maxWidth: "95%", height: "500px" }}>
                <iframe
                    title="Mapa de ubicación"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.405759012939!2d-68.86486118518643!3d-32.8913969282175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967ce37398ff239d%3A0xe59eeea6f8de462f!2sAv.%20Aristides%20Villanueva%20436%2C%20Mendoza!5e0!3m2!1sen!2sar!4v1622446253133!5m2!1sen!2sar"
                    className="w-100 h-100"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default DondeEstamos;
