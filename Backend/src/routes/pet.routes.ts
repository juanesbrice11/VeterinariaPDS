import { Router } from "express";
import {
    createPet,
    getMyPets,
    getPetById,
    updatePet,
    deletePet
} from "../controllers/pet.controller";
import authenticateToken from "../middlewares/authenticateToken";

const router = Router();

router.get("/", authenticateToken, getMyPets);
router.get("/:id", authenticateToken, getPetById);
router.post("/", authenticateToken, createPet);
router.put("/:id", authenticateToken, updatePet);
router.delete("/:id", authenticateToken, deletePet);

export default router;
