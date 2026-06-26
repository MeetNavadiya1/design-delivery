import axiosClient from "../api/axios-client";

export const agencyEmployeeService = {
  async createEmployee(payload) {
    try {
      const response = await axiosClient.post("/employees", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateEmployee(payload, empId) {
    try {
      const response = await axiosClient.patch(`/employees/${empId}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteEmployee(empId) {
    try {
      const response = await axiosClient.delete(`/employees/${empId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getEmployeeById(empId) {
    try {
      const response = await axiosClient.get(`/employees/${empId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getEmployees(params = {}) {
    try {
      const response = await axiosClient.get("/employees", {
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
