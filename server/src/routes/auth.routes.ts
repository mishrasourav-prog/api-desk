import express from "express";
import { registerUser , loginUser, logoutUser , refreshAccessToken, changePassword, generateOtp, verifyUserForgotPasswordandReset,verifyOtpOnly} from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import passport from "passport";
import { googleCallbackController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshAccessToken);
router.put("/change-password",verifyJWT,changePassword);
router.post("/forgot-password", generateOtp);
router.post(
  "/reset-password",
  verifyUserForgotPasswordandReset
);
router.post("/verify-otp",verifyOtpOnly);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  googleCallbackController
);

export default router;