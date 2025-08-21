import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; 

export default {
  async login(email, password) {
    return axios.post(`${API_URL}/login`, { email, password });
  },

  async logout() {
    const token = localStorage.getItem("token");
    return axios.post(
      `${API_URL}/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  async getVacaciones(token) {
    return axios.get(`${API_URL}/vacaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createVacacion(data, token) {
    return axios.post(`${API_URL}/vacaciones`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
