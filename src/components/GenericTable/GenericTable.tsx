import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Button, Table, FormControl, Container, Row, Col } from 'react-bootstrap';
import { ITableProps, IColumn } from '../../interface/ICamposTablaGenerica';
import DatePicker from 'react-datepicker';

function GenericTable<T>({
  data,
  columns,
  actions,
  onAdd,
  onUpdate,
  onDelete,
  onView,
  customSearch,
  customDate,
  showDate = false,
}: ITableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleSearch = async () => {
      if (customSearch) {
        setIsLoading(true);
        const filteredData = await customSearch(searchText);
        if (isMounted) {
          setFilteredData(filteredData);
          setIsLoading(false);
        }
      } else {
        setFilteredData(
          data.filter((item) => defaultSearch(item, searchText, columns))
        );
      }
    };

    handleSearch();

    return () => {
      isMounted = false;
    };
  }, [searchText, data, customSearch, columns]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (customSearch) {
      setIsLoading(true);
      const normalizedSearchText = normalizeString(searchText);
      const filteredData = await customSearch(normalizedSearchText);
      setFilteredData(filteredData);
      setIsLoading(false);
    }
  };
  
  //sirve para buscar todo en minuscula, sin importar tildes
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize("NFD") // Eliminar tildes
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const handleDateSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (customDate) {
      setIsLoading(true);
      // Aplicar lógica de filtrado similar a handleBuscarClick
      const filteredData = await customDate(firstDate || null, secondDate || null);

      if (filteredData && filteredData.length > 0) {
        setFilteredData(filteredData);
      } else {
        // Si no hay resultados, puedes manejarlo como desees, por ejemplo, mostrando un mensaje
        console.log("No hay resultados para las fechas seleccionadas.");
      }

      setIsLoading(false);
    }
  };

  const defaultSearch = (item: T, search: string, columns: IColumn<T>[]): boolean =>
  columns.some((column) => {
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
          {showDate === true && (
            <Col sm={8} style={{ marginTop: "10px" }}>
              <form onSubmit={handleDateSearch} className='d-flex'>
                <div style={{ marginRight: "10px" }}>
                  <DatePicker
                    placeholderText="Fecha Inicial"
                    selected={firstDate}
                    onChange={(date: Date | null) => setFirstDate(date)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    className="form-control"
                  />
                </div>
                <DatePicker
                  placeholderText='Fecha Final'
                  selected={secondDate}
                  onChange={(date: Date | null) => setSecondDate(date)}
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  className="form-control"
                />
                <Button variant="outline-secondary" style={{ marginLeft: "10px" }} type="submit" onClick={handleDateSearch} disabled={isLoading} className="ml-2">
                  <i className="bi bi-search" ></i>
                </Button>
              </form>
            </Col>
          )}
          <form onSubmit={handleSearchSubmit} className="d-flex" style={{marginTop: "10px"}}>
            <FormControl
              placeholder="Buscar"
              aria-label="Search"
              aria-describedby="basic-addon2"
              onChange={handleSearchChange}
              value={searchText}
            />
            <Button variant="outline-secondary" type="submit" disabled={isLoading} className="ml-2" style={{marginLeft:"10px"}}>
              <i className="bi bi-search"></i>
            </Button>
          </form>
          
        </Col>
      </Row>
      <Table responsive className="table table-bordered mt-2">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ width: `${column.width ? column.width * 100 / 12 : ""}%` }}>
                {column.title}
              </th>
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
                {actions.update && (
                  <Button variant="primary" className='mx-2' onClick={() => onUpdate!(item)}>
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                )}
                {actions.delete && (
                  <Button variant="danger" className='mx-2' onClick={() => onDelete!(item)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                )}
                {actions.view && (
                  <Button variant="info" className='mx-2' onClick={() => onView!(item)}>
                    <i className="bi bi-eye"></i>
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default GenericTable;
