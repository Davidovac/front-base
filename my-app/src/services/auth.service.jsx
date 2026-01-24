import api from "./Api.jsx";

export const login = async (userName, password) => {

  const loginData = {
    userName: userName,
    password: password
  }

  const response = await api.post("/auth/login", loginData);

  if (response.data) {
    sessionStorage.setItem("token", response.data);
  }

  return response.data;
};