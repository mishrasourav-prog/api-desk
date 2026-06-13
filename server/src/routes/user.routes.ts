import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { deleteUser, editUser , getCurrentUser } from "../controllers/user.controller";

const router = Router();

router.use(verifyJWT);

router.get("/me",  getCurrentUser);

router.patch("/edit",editUser);
router.delete("/delete",deleteUser);


export default router;