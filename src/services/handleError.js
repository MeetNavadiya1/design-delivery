import { toast } from "sonner";

let message = "error";
export const HandleError = async (error) => {
  message =
    error?.message ||
    error?.data?.message ||
    error?.response?.data?.message ||
    error?.response?.message ||
    "Unexpected error occurred.";

  if (!error?.message && !error?.data?.message && !error?.response?.data?.message) {
    switch (error.status) {
      case 400:
        message = "Invalid request.";
        break;

      case 401:
        message = "Please login to continue.";
        break;

      case 403:
        message = "You don't have permission for this action.";
        break;

      case 404:
        message = "Requested resource not found.";
        break;

      case 409:
        message = "Resource already exists.";
        break;

      case 422:
        message = "Please check the entered data.";
        break;

      case 429:
        message = "Too many requests. Please wait a moment.";
        break;

      case 500:
        message = "Something went wrong. Please try again later.";
        break;

      case 503:
        message = "Service temporarily unavailable.";
        break;

      default:
        message = "Unexpected error occurred.";
    }
  }

  toast.error(message);
};
