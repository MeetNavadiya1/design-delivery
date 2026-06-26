import axiosClient from "../api/axios-client";

export const agencyClientServices = {
  async getDashboardDetails() {
    try {
      const response = await axiosClient.get("/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createClient(payload) {
    try {
      const response = await axiosClient.post("/client", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateClient(payload, clientId) {
    try {
      const response = await axiosClient.patch(`/client/${clientId}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteClient(clientId) {
    try {
      const response = await axiosClient.delete(`/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getClientById(clientId) {
    try {
      const response = await axiosClient.get(`/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getClients(params = {}) {
    try {
      const response = await axiosClient.get("/client", {
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search,
          sort: params.sort,
          order: params.order,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
