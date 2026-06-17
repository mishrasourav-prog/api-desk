import toast from "react-hot-toast";

export const handleApiError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    "Something went wrong";

  toast.error(message);

  throw error;
};