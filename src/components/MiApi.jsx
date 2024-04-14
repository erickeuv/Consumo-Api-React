import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MiApi = ({ search }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDescription, setPokemonDescription] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0); // Offset inicial
  const [limit] = useState(40); // Cantidad de Pokémon a cargar por página
  const [sortBy, setSortBy] = useState(""); // Estado para el criterio de ordenamiento

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        const urlBase = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
        const response = await fetch(urlBase);
        if (!response.ok) {
          throw new Error('Error al recuperar los datos del servidor');
        }
        const data = await response.json();
        const pokemonUrls = data.results.map(pokemon => pokemon.url);
        const pokemonSpecies = pokemonUrls.map(url => url.replace('pokemon', 'pokemon-species')); // URL de especies de Pokémon
        const pokemonDetails = await Promise.all(pokemonUrls.map(url => fetch(url).then(response => response.json())));
        const pokemonDesc = await Promise.all(pokemonSpecies.map(url => fetch(url).then(response => response.json())));
        setPokemonList(pokemonDetails); // Reemplazar la lista existente con la nueva página de Pokémon
        setPokemonDescription(pokemonDesc); // Reemplazar la lista existente con los detalles de la descripción
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchPokemonData();

    return () => {
      setPokemonList([]);
      setPokemonDescription([]);
      setLoading(true);
    };
  }, [offset, limit]);

  // Filtrar la lista de Pokémon según el término de búsqueda
  const filteredPokemonList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  // Ordenar la lista de Pokémon según el criterio seleccionado
  const sortedPokemonList = [...filteredPokemonList];
  if (sortBy === "name") {
    sortedPokemonList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "id") {
    sortedPokemonList.sort((a, b) => a.id - b.id);
  }

  // URL base para las imágenes de los Pokémon
  const urlImgPokemonFull = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/';

  // Manejar la carga de más Pokémon
  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  // Manejar el cambio en el criterio de ordenamiento
  const handleSortChange = (sortBy) => {
    setSortBy(sortBy);
  };

  

  return (
    <div>
      <div className='filtros'>
        <Button variant="outline-primary" onClick={() => handleSortChange("name")} style={{ marginRight: '10px' }}>Ordenar por Nombre</Button>
        <Button variant="outline-primary" onClick={() => handleSortChange("id")}>Ordenar por ID</Button>
      </div>
      <Row xs={1} md={4} className="g-4">
        {sortedPokemonList.map((pokemon, index) => (
          <Col key={pokemon.id} xs={12} md={3}>
            <Card style={{ width: '18rem', height: "30rem" }}>
              <Card.Img
                variant="top"
                src={`${urlImgPokemonFull}${pokemon.id.toString().padStart(3, '0')}.png`}
                alt={pokemon.name}
              />
              <Card.Body  >
                <Card.Title className="PokemonDetails">
                  {pokemon.name} <br /> {pokemon.id.toString().padStart(3, '0')}
                </Card.Title>
                <Card.Text>
                  {pokemonDescription[index] && pokemonDescription[index].flavor_text_entries[26] ? (
                    pokemonDescription[index].flavor_text_entries[26].flavor_text
                  ) : (
                    "Descripción no disponible"
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mostrar mensaje de carga si está cargando */}
      {loading && <p>Cargando...</p>}

      {/* Mostrar botón para cargar más Pokémon */}
      {!loading && (
        <Button className="ButtonLoad" onClick={handleLoadMore} disabled={loading}>
          Cargar más
        </Button>
      )}
    </div>
  );
};

export default MiApi;
