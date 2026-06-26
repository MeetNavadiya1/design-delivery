import axiosClient from "../api/axios-client";
import publicClient from "../api/public-client";
import axios from "axios";

export const authServices = {

    async getUserDetails() {
        try {
            const response = await axiosClient.get("/auth/me");
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    
    async loginUser(payload) {
        try {
            const response = await publicClient.post("/auth/login", payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async registerUser(payload) {
        try {
            const response = await publicClient.post("/auth/verify-user-on-register", payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async forgotPasswordUser(payload) {
        try {
            const response = await publicClient.post("/auth/forgot-password-mail", payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async verifyOtp(payload) {
        try {
            const response = await publicClient.post("/auth/otp-verify-user-register", payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async resendOtp(payload) {
        try {
            const response = await publicClient.post("/auth/resend-otp", payload)
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async resetPassword(payload) {
        try {
            const response = await publicClient.post("/auth/update-forgot-password", payload)
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Generate upload URL for S3
    async generateUploadUrl(fileName, contentType, fileSize) {
        try {
            const res = await publicClient.post("/upload/generate-url", {
                fileName,
                fileType: contentType,
                contentType: contentType,
                fileSize,
                folder: "avatars"
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Upload file to S3
    async uploadFileToS3(uploadUrl, file, contentType) {
        try {
            const res = await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": contentType,
                },
            });
            return res.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

};
