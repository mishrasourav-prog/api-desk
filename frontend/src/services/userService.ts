import api from "../config/axiosInstance.Config";
import { handleApiResponse } from "../utils/apiHandler";
import { handleApiError } from "../utils/apiError";

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/user/me");
    return handleApiResponse(res);
  } catch (err) {
    handleApiError(err);
  }
};


export const changePassword = async (data: {
  currpassword: string;
  newpassword: string;
}) => {
  try {
    const res = await api.patch("/user/change-password", data);
    return handleApiResponse(res);
  } catch (err) {
    handleApiError(err);
  }
};

export const deleteAccount = async () => {
  try {
    await api.post("/auth/refresh");

    const res = await api.delete("/user/delete", {
      data: { DELETE: "DELETE" },
    });

    return handleApiResponse(res);
  } catch (err) {
    handleApiError(err);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post("/auth/forgot-password", {
      email,
    });

    return handleApiResponse(res);
  } catch (err) {
    handleApiError(err);
  }
};



export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/login", data);

    return handleApiResponse(res); // ✅ backend message → toast.success
  } catch (err) {
    handleApiError(err); // ✅ backend error → toast.error
  }
};

export const registerUser = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/register", data);

    return handleApiResponse(res); // ✅ backend success message → toast
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newpassword: string
) => {
  try {
    const res = await api.post("/auth/reset-password", {
      email,
      otp,
      newpassword,
    });

    return handleApiResponse(res); // ✅ backend success message → toast.success
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};

export const getUserDecks = async () => {
  try {
    const res = await api.get("/deck/list");

    return handleApiResponse(res); // ✅ uses backend message if any
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};

export const deleteDeck = async (id: string) => {
  try {
    const res = await api.delete(`/deck/${id}`);

    return handleApiResponse(res); // ✅ backend success message → toast.success
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};

export const getDeckById = async (id: string) => {
  try {
    const res = await api.get(`/deck/${id}`);

    return handleApiResponse(res); // ✅ uses backend success message if present
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};

export const updateDeck = async (
  id: string,
  data: {
    path: string;
    method: string;
    responseStatus: number;
    responseBody: unknown;
    description?: string;
  }
) => {
  try {
    const res = await api.put(`/deck/${id}`, data);

    return handleApiResponse(res); // ✅ backend success message → toast.success
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};

export const createDeck = async (data: {
  path: string;
  method: string;
  responseStatus: number;
  responseBody: unknown;
  description?: string;
}) => {
  try {
    const res = await api.post("/deck/create", data);

    return handleApiResponse(res); // ✅ backend success message → toast.success
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};

export const updateUser = async (data: {
  name?: string;
  username?: string;
  email?: string;
}) => {
  try {
    const res = await api.patch("/user/edit", data);

    return handleApiResponse(res); // ✅ backend success message → toast.success
  } catch (err) {
    handleApiError(err); // ❌ backend error message → toast.error
  }
};


export const verifyOtp = async (email: string, otp: string) => {
  try {
    const res = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const resendOtp = async (email: string) => {
  try {
    const res = await api.post("/auth/forgot-password", {
      email,
    });

    return res.data;
  } catch (err) {
    handleApiError(err);
  }
};