import axios from 'axios';

let api = axios.create({
  baseURL: 'https://localhost:5231/api',
});

api.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logika za automatsku odjavu korisnika ili osveženje tokena
      console.log('Niste autorizovani, molimo prijavite se ponovo.');
    }
    return Promise.reject(error);
  }
);

export default api;