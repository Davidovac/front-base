import React, { useEffect, useState } from "react";
import "../styles.scss";
import { useNavigate } from "react-router-dom";

const AnimalsManage = () => {
  const navigate = useNavigate();
  const [xys, setXXs] = useState([]);
  const [selectedXX, setSelectedXX] = useState(null);
  const [selectedYY, setSelectedYY] = useState(null);
  const [showYYModal, setShowYYModal] = useState(false);
  const [filters, setFilters] = useState({
    species: '',
    cageCode: '',
    cagelessOnly: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchXXs = async () => {
    try {
      setLoading(true);
      const response = await getFilteredXXs({...filters});
      setXXs(response);
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

  const deleteXXFn = async (xyId) => {
    try {
      setLoading(true);
      const response = await deleteXX(xyId);
      await fetchXXs();
      alert("Uspesno ste obrisali xx-u!");
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
      const payload = selectedXX;
      payload.yxId = Number(selectedYY);
      const response = await updateXX(selectedXX.id, payload);
      await fetchXXs();
      alert("Uspesno ste postavili!");
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
      setShowYYModal(false);
    }
  };

  useEffect(() => {
    fetchXXs();
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
    <div id="xys-manage-container">
      <h1>Animals Management</h1>
      <div className="xys-filters-row">
        <h3>Filters:</h3>
        <div className="xys-filter-item">
          <label>Species:</label>
          <input type="text" name="species" value={filters.species} onChange={handleFilterChange} />
        </div>
        <div className="xys-filter-item">
          <label>Cage Code:</label>
          <input type="text" name="cageCode" value={filters.cageCode} onChange={handleFilterChange} />
        </div>
        <div className="animals-filter-item">
          <label>Cageless Only:</label>
          <input type="checkbox" name="cagelessOnly" checked={filters.cagelessOnly} onChange={handleFilterChange} />
        </div>
      </div>
      <div>
        <button onClick={() => fetchXXs()}>Apply Filters</button>
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
          {xys?.length == 0 ? <tr><td colSpan="6">No xys found.</td></tr> : xys.map((xy) => (
            <tr key={xy.id}>
              <td>{xy.id}</td>
              <td>{xy.name}</td>
              <td>{xy.species}</td>
              <td>{xy.weight}</td>
              <td style={xy?.cageId ? {color: 'green'} : {color: 'red'}}>{xy?.yxId ? 'Yes' : 'No'}</td>
              <td>{xy?.yxId ? <></> : <button onClick={() => {setShowYYModal(true); setSelectedXX(xy)}}>Do</button>}</td>
              <td><button onClick={() => navigate(`/xyForm/${xy.id}`)}>Edit</button></td>
              <td><button onClick={() => deleteAnimalFn(xy.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showYYModal && <div className="over-layer-base">
        <div className="modal-base">
          <h2>Do something</h2>
          <h4>Selected xy: {selectedXX?.name}</h4>
          <div>
            <label>Cage Code:</label>
            <select name="cageCode" onChange={(e) => setSelectedYY(e.target.value)}>
              {yxs.map((yx) => (
                <option key={yx.id} value={yx.id}>{yx.code}</option>
              ))}
            </select>
          </div>
          <button onClick={() => editFn()}>Edit</button>
          <button onClick={() => setShowYYModal(false)}>Cancel</button>
        </div>
      </div>}
    </div>
  );
};

export default AnimalsManage;