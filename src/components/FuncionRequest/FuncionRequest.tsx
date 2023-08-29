/**
 * Realiza una solicitud HTTP utilizando el método especificado.
 * @param method Método HTTP (GET, POST, PUT, DELETE, etc.).
 * @param endpoint URL del endpoint al que se realizará la solicitud.
 * @param body Cuerpo de la solicitud (opcional, utilizado en POST y PUT).
 * @returns Objeto JSON con la respuesta de la solicitud.
 */
export const handleRequest = async (method: string, endpoint: string, body?: object) => {
  try {
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al realizar la solicitud');
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Realiza una solicitud HTTP a un endpoint específico, opcionalmente con un ID.
 * @param method Método HTTP (GET, POST, PUT, DELETE, etc.).
 * @param endpoint URL del endpoint base al que se realizará la solicitud.
 * @param id ID opcional para identificar un recurso específico.
 * @param body Cuerpo de la solicitud (opcional, utilizado en POST y PUT).
 * @returns Objeto JSON con la respuesta de la solicitud.
 */
export const handleRequestSingle = async (method: string, endpoint: string, id?: string, body?: object) => {
  try {
    let url = endpoint;
    if (id) {
      url += `/${id}`;
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al realizar la solicitud');
    }
  } catch (error) {
    console.log(error);
  }
};
