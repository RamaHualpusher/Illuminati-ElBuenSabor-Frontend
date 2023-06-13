import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchParam, setSearchParam] = useState('');

  return (
    <SearchContext.Provider value={{ searchParam, setSearchParam }}>
      {children}
    </SearchContext.Provider>
  );
};
