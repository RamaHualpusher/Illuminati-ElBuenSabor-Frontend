import { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

interface Props {
    onSearch: (searchTerm: string) => void;
}

const FoodSearch: React.FC<Props> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <form onSubmit={handleSubmit} style={{ width: "90vh" }}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Buscar Comida"
                        aria-label="Buscar Comida"
                        aria-describedby="basic-addon2"
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <Button variant="secondary" id="button-addon2" type="submit">
                        Buscar
                    </Button>
                </InputGroup>
            </form>
        </div>

    );
};

export default FoodSearch;
