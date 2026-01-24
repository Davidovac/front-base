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
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEntity();
    }
  }, []);

  useEffect(() => {
    if (entity) {
      reset({
        name: entity.name,
      });
    }
  }, [entity]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      if (id) {
        const response = await update(id, payload);
        alert("Uspesno ste izmenili x!");
      } else {
        const response = await create(payload);
        alert("Uspesno ste kreirali x!");
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

  const fetchEntity = async () => {
    try {
      setLoading(true);
      const response = await getOneX(id);
      setEntity(response);
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('Niste uneli validne podatke.');
        } else if (error.response.status === 404) {
          setError('Pogresna ruta.');
        } else if (error.response.status === 401) {
          setError('Ova stranica je rezervisana samo za X .');
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
    <div id="animal-create-container">
      <h2>Create X</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" {...register("name")} />
        </div>
        <div>
          <label>X Connected entities/Enums search:</label>
          <Controller name="animalSpeciesId" control={control} render={({ field }) => (
            <Select {...field} options={species.map(s => ({value: s.id, label: s.name}))} value={entitiesY
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