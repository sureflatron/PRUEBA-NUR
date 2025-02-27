import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const UserService = {
    //Iniciar sesión
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    },

    //Obtener todos los usuarios
    getUsers: async (token) => {
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    //Obtener un usuario por ID
    getUserById: async (id, token) => {
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    //Editar usuario
    editUser: async (id, user, token) => {
        const response = await axios.put(`${API_URL}/users/${id}`, user, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createUser: async ( user, token) => {
          const response = await axios.post(`${API_URL}/users`, user, {
              headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
  },

    //Eliminar usuario
    deleteUser: async (id, token) => {
        await axios.delete(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
};

export default UserService;
