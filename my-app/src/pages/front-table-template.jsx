import React, { useEffect, useState } from "react";
import "../styles.scss";
import { useNavigate } from "react-router-dom";

const AnimalsManage = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedCage, setSelectedCage] = useState(null);
  const [showCageModal, setShowCageModal] = useState(false);
  const [filters, setFilters] = useState({
    species: '',
    cageCode: '',
    cagelessOnly: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await getFilteredAnimals({...filters});
      setAnimals(response);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne filtere.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za Admina .');
        } else if (error.response.status === 500) {
          setError('Greska na serveru. Pokusajte kasnije.');
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Nema odgovora sa servera.');
      } else {
        setError('Doslo je do greske.');
      }
      console.error('Greska:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnimalFn = async (animalId) => {
    try {
      setLoading(true);
      const response = await deleteAnimal(animalId);
      await fetchAnimals();
      alert("Uspesno ste obrisali zivotinju!");
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne filtere.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za Admina .');
        } else if (error.response.status === 500) {
          setError('Greska na serveru. Pokusajte kasnije.');
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Nema odgovora sa servera.');
      } else {
        setError('Doslo je do greske.');
      }
      console.error('Greska:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const editFn = async () => {
    try {
      setLoading(true);
      const payload = selectedAnimal;
      payload.cageId = Number(selectedCage);
      const response = await updateAnimal(selectedAnimal.id, payload);
      await fetchAnimals();
      alert("Uspesno ste postavili zivotinju u kavez!");
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne filtere.');
        } else if (error.response.status === 404) {
          setError('Zivotinja sa ovim id-em ne postoji ili Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za Admina .');
        } else if (error.response.status === 500) {
          setError('Greska na serveru. Pokusajte kasnije.');
        } else {
          setError(`Greska: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Nema odgovora sa servera.');
      } else {
        setError('Doslo je do greske.');
      }
      console.error('Greska:', error.message);
    } finally {
      setLoading(false);
      setShowCageModal(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);


  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  function resetFilters() {
    setFilters((prev => ({
      ...prev, species: '', cageCode: '', cagelessOnly: false
    })));
  }

  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return(
    <div id="animals-manage-container">
      <h1>Animals Management</h1>
      <div className="animals-filters-row">
        <h3>Filters:</h3>
        <div className="animals-filter-item">
          <label>Species:</label>
          <input type="text" name="species" value={filters.species} onChange={handleFilterChange} />
        </div>
        <div className="animals-filter-item">
          <label>Cage Code:</label>
          <input type="text" name="cageCode" value={filters.cageCode} onChange={handleFilterChange} />
        </div>
        <div className="animals-filter-item">
          <label>Cageless Only:</label>
          <input type="checkbox" name="cagelessOnly" checked={filters.cagelessOnly} onChange={handleFilterChange} />
        </div>
      </div>
      <div>
        <button onClick={() => fetchAnimals()}>Apply Filters</button>
        <button onClick={() => resetFilters()}>Reset Filters</button>
      </div>
      <button onClick={() => navigate("/animalForm")}>Create Animal</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Species</th>
            <th>Weight</th>
            <th>Is Caged?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {animals?.length == 0 ? <tr><td colSpan="6">No animals found.</td></tr> : animals.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.name}</td>
              <td>{animal.species}</td>
              <td>{animal.weight}</td>
              <td style={animal?.cageId ? {color: 'green'} : {color: 'red'}}>{animal?.cageId ? 'Yes' : 'No'}</td>
              <td>{animal?.cageId ? <></> : <button onClick={() => {setShowCageModal(true); setSelectedAnimal(animal)}}>Put in Cage</button>}</td>
              <td><button onClick={() => navigate(`/animalForm/${animal.id}`)}>Edit</button></td>
              <td><button onClick={() => deleteAnimalFn(animal.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCageModal && <div className="over-layer-base">
        <div className="put-in-cage-modal">
          <h2>Put Animal in Cage</h2>
          <h4>Selected animal: {selectedAnimal?.name}</h4>
          <div>
            <label>Cage Code:</label>
            <select name="cageCode" onChange={(e) => setSelectedCage(e.target.value)}>
              {cages.map((cage) => (
                <option key={cage.id} value={cage.id}>{cage.code}</option>
              ))}
            </select>
          </div>
          <button onClick={() => editFn()}>Edit</button>
          <button onClick={() => setShowCageModal(false)}>Cancel</button>
        </div>
      </div>}
    </div>
  );
};

export default AnimalsManage;