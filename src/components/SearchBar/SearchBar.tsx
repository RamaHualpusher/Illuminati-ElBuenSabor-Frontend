import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

interface SearchBarProps {
    onSearch: (searchParam: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [search, setSearch] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        onSearch(search);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <InputGroup className="mb-4">
            <FormControl
                placeholder="Buscar"
                aria-label="Buscar"
                aria-describedby="basic-addon2"
                value={search}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
                <i className="bi bi-search"></i>
            </Button>
        </InputGroup>
    );
};

export default SearchBar;
