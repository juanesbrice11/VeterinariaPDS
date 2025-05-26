import { Router } from "express";
import {
    getUsers,
    getMyProfile,
    editProfile,
    changePassword,
    updateUserRole,
    deleteUser,
    getUserById
} from "../controllers/user.controller";
import  authenticateToken  from "../middlewares/authenticateToken";
import  {validateProfileUpdate} from "../middlewares/validateEmail";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", getUsers);
router.get("/:id", authenticateToken, authorizeRoles('Admin'), getUserById);

router.get("/me", authenticateToken, getMyProfile);
router.put("/me", authenticateToken, validateProfileUpdate, editProfile);
router.patch("/me/password", authenticateToken, changePassword);
router.put('/:documentNumber/role',authenticateToken, authorizeRoles('Admin'), updateUserRole);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteUser);

export default router;
