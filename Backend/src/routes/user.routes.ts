import { Router } from "express";
import {
    getUsers,
    getMyProfile,
    editProfile,
    changePassword
} from "../controllers/user.controller";
import  authenticateToken  from "../middlewares/authenticateToken";
import  {validateProfileUpdate} from "../middlewares/validateEmail";

const router = Router();

router.get("/", getUsers);

router.get("/me", authenticateToken, getMyProfile);
router.put("/me", authenticateToken, validateProfileUpdate, editProfile);
router.patch("/me/password", authenticateToken, changePassword);

export default router;
