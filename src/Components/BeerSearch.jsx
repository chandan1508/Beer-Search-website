
import React, { useState, useEffect } from "react";
import axios from "axios";

const BeerSearch = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBeers, setFilteredBeers] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

 
  const fetchBeers = async () => {
    try {
      const response = await axios.get("https://api.sampleapis.com/beers/ale");
      setBeers(response.data);
      setFilteredBeers(response.data); 
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  useEffect(() => {
    fetchBeers();
  }, []);

 
  useEffect(() => {
    if (searchTerm) {
      setFilteredBeers(
        beers.filter((beer) =>
          beer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBeers(beers); 
    }
  }, [searchTerm, beers]);


  const handleImageError = (beerId) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [beerId]: true, 
    }));
  };

  return (
    <div>
      <nav>
        <div>
          <h1>Beer Search</h1>
        </div>

        <div className="searchBar">
          <input
            type="text"
            placeholder="Search for beers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={fetchBeers}>Search</button>
        </div>
      </nav>

      <div className="cardContainer">
        {filteredBeers.length > 0 ? (
          filteredBeers.map((beer) => {
           
            if (imageErrors[beer.id] || !beer.image) {
              return null;
            }

            return (
              <div className="card" key={beer.id}>
                <img
                  src={beer.image}
                  alt={beer.name}
                  onError={() => handleImageError(beer.id)} 
                />
                <div className="container">
                  <h3 className="title">{beer.name}</h3>
                  <p>Price: {beer.price}</p>
                  <p>
                    Rating: {beer.rating.average.toFixed(1)} ({beer.rating.reviews} reviews)
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No beers found</p>
        )}
      </div>
    </div>
  );
};

export default BeerSearch;

