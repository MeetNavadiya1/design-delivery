import axiosClient from "../api/axios-client";

export const agencyTaskService = {
    async getaStastics(projectId) {
        try {
            const response = await axiosClient.get(`/task/project/${projectId}/stats`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async createTask(payload, projectId) {
        try {
            const response = await axiosClient.post(`/task/project/${projectId}`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async updateTask(payload, taskId) {
        try {
            const response = await axiosClient.patch(`/task/${taskId}`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async deleteTask(taskId) {
        try {
            const response = await axiosClient.patch(`/task/${taskId}/delete`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getTaskById(taskId) {
        try {
            const response = await axiosClient.get(`/task/${taskId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getTasks(projectId, params = {}) {
        try {
            const response = await axiosClient.get(`/task/project/${projectId}`, {
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search || "",
                    order: params.order || "desc",
                    sort: params.sort || "createdAt",
                    status: params.status || "",
                },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getTasksDetailsById(taskId) {
        try {
            const response = await axiosClient.get(`/asset/?taskId=${taskId}`);
            return response.data
        } catch (error) {
            throw error.response?.data || error;            
        }
    },

    async getAssetById(assetId) {
        try {
            const response = await axiosClient.get(`/asset/${assetId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async shareAssetViaEmail(payload) {
        try {
            const response = await axiosClient.post(`/share/email`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async shareAssetViaWhatsapp(payload) {
        try {
            const response = await axiosClient.post(`/share/whatsapp`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async createComment(payload) {
        try {
            const response = await axiosClient.post(`/comment`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async uploadTask(payload, taskId) {
        const body = {...payload, taskId}
        try {
            const response = await axiosClient.post(`/asset`, body); 
            return response.data
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
