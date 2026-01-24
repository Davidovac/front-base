import api from "./Api.jsx"

export const getXs = async () => {
    const response = await api.get("xs");
    
    return response.data;
}

export const getOneX = async (id) => {
    const response = await api.get("xs/" + id);

    return response.data;
}

export const deleteX = async (id) => {
    const response = await api.delete("xs/" + id);

    return response.data;
}

export const updateX = async (id, data) => {
    const response = await api.put("xs/" + id, data);
    
    return response.data;
}

export const createX = async (data) => {
    const response = await api.post("xs", data);
    
    return response.data;
}