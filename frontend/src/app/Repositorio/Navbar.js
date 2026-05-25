import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  }

  return (
    <div className="navbar">
      <img
              src={require("../../assets/images/logo.png")}
              alt="logo"
              height="40"
              style={{ marginRight:  "-2em !important" }}
              className="mr-0 lg:mr-6 align-self-center"
            />
      <h1>Repositório de Projetos de Fim de Curso</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Pesquisar projetos..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button type="submit">Pesquisar</button>
      </form>
    </div>
  );
}

export default Navbar;
