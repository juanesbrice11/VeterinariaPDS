import { Router } from "express";
import {
    createPet,
    getMyPets,
    getPetById,
    updatePet,
    deletePet,
    createPetSecretary,
    getPetByIdSecretary
} from "../controllers/pet.controller";
import authenticateToken from "../middlewares/authenticateToken";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", authenticateToken, getMyPets);
router.get("/:id", authenticateToken, getPetById);
router.post("/", authenticateToken, createPet);
router.post("/Secretary", authenticateToken, authorizeRoles('Admin', 'Secretary'), createPetSecretary);
router.get("/Secretary/:id", authenticateToken, authorizeRoles('Admin', 'Secretary'), getPetByIdSecretary)
router.put("/:id", authenticateToken, updatePet);
router.delete("/:id", authenticateToken, deletePet);

export default router;
