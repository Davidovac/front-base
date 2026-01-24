import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";
import "../styles.scss";

const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      const response = await login(payload);
      alert("Uspesno ste se prijavili!");
      navigate("/animalsManage");
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



  if (loading) return <div id="loadingSpinner" className="spinner"></div>;
  return(
    <div id="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input type="text" name="userName" {...register("userName")} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" {...register("password")} />
        </div>
        <button>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;