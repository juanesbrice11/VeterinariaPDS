import { Router } from "express";
import {
    createPet,
    getMyPets,
    getPetById,
    updatePet,
    deletePet,
    createPetSecretary,
    getPetByIdSecretary,
    getAllPetsV2,
    deletePetAdmin,
    updatePetAdmin
} from "../controllers/pet.controller";
import authenticateToken from "../middlewares/authenticateToken";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/", authenticateToken, getMyPets);
router.get("/all", authenticateToken, authorizeRoles('Admin', 'Secretary'), getAllPetsV2);
router.get("/:id", authenticateToken, getPetById);
router.post("/", authenticateToken, createPet);
router.post("/Secretary", authenticateToken, authorizeRoles('Admin', 'Secretary'), createPetSecretary);
router.get("/Secretary/:id", authenticateToken, authorizeRoles('Admin', 'Secretary'), getPetByIdSecretary)
router.put("/:id", authenticateToken, updatePet);
router.put("/admin/:id", authenticateToken, authorizeRoles('Admin', 'Secretary'), updatePetAdmin);
router.delete("/:id", authenticateToken, deletePet);
router.delete("/admin/:id", authenticateToken, authorizeRoles('Admin', 'Secretary'), deletePetAdmin);

export default router;
