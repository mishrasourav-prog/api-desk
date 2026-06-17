import toast from "react-hot-toast";

export const handleApiResponse = (response: any) => {
  const data = response?.data;

  if (data?.message) {
    if (data?.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }

  return data;
};