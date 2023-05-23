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
  