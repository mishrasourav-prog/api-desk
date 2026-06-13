import api from "../config/axiosInstance.Config";

export const getCurrentUser = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const updateUser = async (data: {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}) => {
  return api.patch("/user/edit", data);
};

export const changePassword = async (data: {
  currpassword: string;
  newpassword: string;
}) => {
  return api.patch("/user/change-password", data);
};

export const deleteAccount = async () => {
  return api.delete("/user/delete", {
    data: {
      DELETE: "DELETE",
    },
  });
};

export const forgotPassword = async (email: string) => {
  return api.post("/user/forgot-password", {
    email,
  });
};

export const resetPassword = async (
  email: string,
  otp: string,
  newpassword: string
) => {
  return api.post("/user/reset-password", {
    email,
    otp,
    newpassword,
  });
};