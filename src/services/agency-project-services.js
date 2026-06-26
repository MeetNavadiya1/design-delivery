import axiosClient from "../api/axios-client";

export const agencyProjectService = {
  async createProject(payload) {
    try {
      const response = await axiosClient.post("/project", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateProject(payload, projectId) {
    try {
      const response = await axiosClient.patch(`/project/${projectId}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteProject(projectId) {
    try {
      const response = await axiosClient.patch(`/project/${projectId}/delete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getProjectById(projectId) {
    try {
      const response = await axiosClient.get(`/project/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getProjects(params = {}) {
    try {
      const response = await axiosClient.get("/project", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          sort: params.sort || "createdAt",
          order: params.order || "desc",
          status: params.statusFilter || "",
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
