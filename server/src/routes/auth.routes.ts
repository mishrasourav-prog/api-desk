import express from "express";
import { registerUser , loginUser, logoutUser , refreshAccessToken, changePassword, generateOtp, verifyUserForgotPasswordandReset} from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshAccessToken);
router.put("change-password",verifyJWT,changePassword);
router.post("/forgot-password", generateOtp);
router.post(
  "/reset-password",
  verifyUserForgotPasswordandReset
);


export default router;