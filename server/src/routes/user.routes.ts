import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", verifyJWT, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: (req as any).user,
  });
});



export default router;