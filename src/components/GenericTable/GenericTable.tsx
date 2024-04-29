import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import {
  Button,
  Table,
  FormControl,
  Container,
  Row,
  Col,
  Overlay,
  Popover,
  Spinner,
} from "react-bootstrap";
import { ITableProps, IColumn } from '../../interface/ICamposTablaGenerica';
import DatePicker from 'react-datepicker';
import NoHayElementosTablaGenerica from '../Page404/NoHayElementosTablaGenerica';

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
  onSearch = true,
  showActions = true,
}: ITableProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [popoverStates, setPopoverStates] = useState(filteredData.map(() => false));
  const [activeTarget, setActiveTarget] = useState<HTMLElement | null>(null); // Estado para el objetivo activo

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    const target = event.currentTarget;
    const newPopoverStates = [...popoverStates];
    newPopoverStates[index] = !newPopoverStates[index];

    // Establecer el objetivo activo
    setActiveTarget(activeTarget === target ? null : target);

    setPopoverStates(newPopoverStates);
  };

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
        setIsLoading(false); // Si no hay customSearch, la carga de datos se completa aquí
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
      const filteredData = await customDate(
        firstDate || null,
        secondDate || null
      );

      if (filteredData && filteredData.length > 0) {
        setFilteredData(filteredData);
      } else {
        // Si no hay resultados, puedes manejarlo como desees, por ejemplo, mostrando un mensaje
        console.log("No hay resultados para las fechas seleccionadas.");
      }

      setIsLoading(false);
    }
  };

  const defaultSearch = (
    item: T,
    search: string,
    columns: IColumn<T>[]
  ): boolean =>
    columns.some((column) => {
      const value = item[column.field];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col sm={1}>
          {actions.create && (
            <Button variant="primary" onClick={onAdd}>
              <i className="bi bi-plus-square"></i>
            </Button>
          )}
        </Col>
        <Col sm={10}>
          {showDate && (
            <Col sm={8} style={{ marginTop: "10px" }}>
              <form onSubmit={handleDateSearch} className="d-flex">
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
                  placeholderText="Fecha Final"
                  selected={secondDate}
                  onChange={(date: Date | null) => setSecondDate(date)}
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  className="form-control"
                />
                <Button
                  variant="outline-secondary"
                  style={{ marginLeft: "10px" }}
                  type="submit"
                  onClick={handleDateSearch}
                  disabled={isLoading}
                  className="ml-2"
                >
                  <i className="bi bi-search"></i>
                </Button>
              </form>
            </Col>
          )}
          {onSearch !== false && (
            <form
              onSubmit={handleSearchSubmit}
              className="d-flex"
              style={{ marginTop: "10px" }}
            >
              <FormControl
                placeholder="Buscar"
                aria-label="Search"
                aria-describedby="basic-addon2"
                onChange={handleSearchChange}
                value={searchText}
              />
              <Button
                variant="outline-secondary"
                type="submit"
                disabled={isLoading}
                className="ml-2"
                style={{ marginLeft: "10px" }}
              >
                <i className="bi bi-search"></i>
              </Button>
            </form>
          )}
        </Col>
      </Row>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          {/* Mostrar componente NoHayElementosTablaGenerica si no hay elementos */}
          {!isLoading && filteredData.length === 0 && (
            <NoHayElementosTablaGenerica onReload={() => window.location.reload()} />
          )}
          {/* Mostrar tabla si no está cargando y hay elementos para mostrar */}
          {!isLoading && filteredData.length > 0 && (
      <Table responsive className="table table-bordered mt-2">
        <thead>
          <tr>
          {columns.map(
              (column, index) =>
                column.showColumn !== false && (
              <th
              key={index}
              style={{
                width: `${
                  column.width ? (column.width * 100) / 12 : ""
                }%`,
                backgroundColor: "#353535",
                color: "white",
              }}
            >
                {column.title}
              </th>
            ))}
            {(actions.update || actions.delete || actions.view) && (
              <th
                style={{
                  backgroundColor: "#353535",
                  color: "white",
                }}
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {columns.map((column, key) => (
                <td key={key}>
                  {column.render
                    ? column.render(item)
                    : String(item[column.field])}
                </td>
              ))}
              {(actions.update || actions.delete || actions.view) && (
                <td>
                  <Button
                    variant="link"
                    className="fs-3 bi bi-three-dots-vertical text-dark"
                    style={{ backgroundColor: "transparent", border: "none" }}
                    onClick={(e) => handleButtonClick(e, index)} // Pasar evento y índice
                  />
                  <Overlay
                    show={popoverStates[index]}
                    target={activeTarget} // Usar el objetivo activo aquí
                    placement="bottom"
                    rootClose
                    onHide={() => {
                      const newPopoverStates = [...popoverStates];
                      newPopoverStates[index] = false;
                      setPopoverStates(newPopoverStates);
                    }}
                  >
                    <Popover id="popover-contained">
                      <Popover.Body className="d-flex flex-column p-1 align-items-start">
                        {actions.update && (
                          <Button
                            variant="link"
                            onClick={() => onUpdate!(item)}
                            className="text-dark"
                            style={{ textDecoration: "none" }}
                          >
                            <i className="bi bi-pencil-square fs-5 me-2"></i>
                            Editar
                          </Button>
                        )}
                        {actions.delete && (
                          <Button
                            variant="link"
                            onClick={() => onDelete!(item)}
                            style={{ textDecoration: "none" }}
                            className="text-dark"
                          >
                            <i className="bi bi-trash fs-5 me-2"></i>
                            Eliminar
                          </Button>
                        )}
                        {actions.view && (
                          <Button
                            variant="link"
                            onClick={() => onView!(item)}
                            style={{ textDecoration: "none" }}
                            className="text-dark"
                          >
                            <i className="bi bi-eye fs-5 me-2"></i>
                            Ver Detalles
                          </Button>
                        )}
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      )}
      </>

        )}
    
    </Container>
  );
}

export default GenericTable;