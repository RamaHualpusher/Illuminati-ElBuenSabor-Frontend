import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Button, Table, InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import { TableProps } from '../../interface/CamposTablaGenerica';

function GenericTable<T>({ data, columns, actions, onAdd, onUpdate, onDelete, onView, customSearch }: TableProps<T>) {
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda
  const [filteredData, setFilteredData] = useState<T[]>(data); // Estado para almacenar los datos filtrados
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está realizando una búsqueda

  useEffect(() => {
    let isMounted = true; // Variable para controlar si el componente está montado

    const handleSearch = async () => {
      if (customSearch) {
        setIsLoading(true); // Habilitar la carga
        const filteredData = await customSearch(searchText); // Realizar la búsqueda personalizada
        if (isMounted) {
          setFilteredData(filteredData); // Actualizar los datos filtrados
          setIsLoading(false); // Deshabilitar la carga
        }
      } else {
        setFilteredData(
          data.filter((item) => defaultSearch(item, searchText))
        );
      }
    };

    handleSearch();

    // Cleanup: establecer la variable isMounted en false cuando el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, [searchText, data, customSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value); // Actualizar el estado del texto de búsqueda cuando cambia
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (customSearch) {
      setIsLoading(true); // Habilitar la carga
      const filteredData = await customSearch(searchText); // Realizar la búsqueda personalizada
      setFilteredData(filteredData); // Actualizar los datos filtrados
      setIsLoading(false); // Deshabilitar la carga
    }
  };

  const defaultSearch = (item: T, search: string): boolean =>
    columns.some(column => {
      const value = item[column.field];
      return typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col sm={1}>
          {actions.create && <Button variant="primary" onClick={onAdd}><i className="bi bi-plus-square"></i></Button>}
        </Col>
        <Col sm={10}>
          <form onSubmit={handleSearchSubmit} className="d-flex">
            <FormControl
              placeholder="Buscar"
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={handleSearchChange}
              value={searchText}
            />
            <Button variant="outline-secondary" type="submit" disabled={isLoading} className="ml-2"><i className="bi bi-search"></i></Button>
          </form>
        </Col>
      </Row>
      <Table responsive>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ width: `${column.width ? column.width * 100 / 12 : ""}%` }}>{column.title}</th>
            ))}
            {(actions.update || actions.delete || actions.view) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {columns.map((column, key) => (
                <td key={key}>
                  {column.render ? column.render(item) : String(item[column.field])}
                </td>
              ))}
              <td>
                {actions.update && <Button variant="primary" className='mx-2' onClick={() => onUpdate!(item)}><i className="bi bi-pencil-square"></i></Button>}
                {actions.delete && <Button variant="danger" className='mx-2' onClick={() => onDelete!(item)}><i className="bi bi-trash"></i></Button>}
                {actions.view && <Button variant="info" className='mx-2' onClick={() => onView!(item)}><i className="bi bi-eye"></i></Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default GenericTable;
