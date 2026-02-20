import React, { useEffect, useState } from "react";
import Select from 'react-select'
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "../styles.scss";

const Form = () => {
  const { id } = useParams();
  const { register, handleSubmit, formState, reset, control } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [xy, setXX] = useState(null);
  const [yxs, setYYs] = useState(null);

  useEffect(() => {
    fetchYYs();
    if (id) {
      fetchXX();
    }
  }, []);

  useEffect(() => {
    if (xy) {
      reset({
        name: xy.name,
        yxId: xy.yxId,
        weight: xy.weight,
        date: xy.date,
      });
    }
  }, [xy]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      if (id) {
        const response = await update(id, payload);
        alert("Uspesno ste izmenili xy!");
      } else {
        const response = await create(payload);
        alert("Uspesno ste kreirali xy!");
        navigate("/");
      }
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
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

  const fetchXX = async () => {
    try {
      setLoading(true);
      const response = await getOneXX(id);
      setXX(response);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za xy .');
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

  const fetchYYs = async () => {
    try {
      setLoading(true);
      const response = await getAllYYs(id);
      setYYs(response);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za yx .');
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


  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  return(
    <div id="xy-create-container">
      <h2>Create XX</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" {...register("name")} />
        </div>
        <div>
          <label>XX Connected entities/Enums search:</label>
          <Controller name="yxId" control={control} render={({ field }) => (
            <Select {...field} options={yxs.map(s => ({value: s.id, label: s.name}))} value={yxs
            .map(s => ({ value: s.id, label: s.name }))
            .find(o => o.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
          />)}
          />
        </div>
        <div>
          <label>Weight:</label>
          <input type="number" name="weight" {...register("weight")} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" name="date" {...register("date")} />
        </div>
        {id ? <button>Edit</button> : <button>Create</button>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Form;