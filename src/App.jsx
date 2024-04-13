import React, { useState } from 'react';
import MiApi from './components/MiApi'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PokemonFilter from './components/PokemonFilter';
import Header from './components/Header';

const App = () => {
  const [search, setSearch] = useState(""); 

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm.target.value);
  };

  return (
    <div>
      <Header/>
      <PokemonFilter search={search} onChange={handleSearch} />
      <MiApi search={search} />
    </div>
  );
};

export default App;