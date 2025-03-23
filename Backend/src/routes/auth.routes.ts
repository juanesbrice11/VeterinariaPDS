import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller";
import { validateSignUp } from "../middlewares/validateUser";

const router = Router();

router.post("/signup", validateSignUp, signUp);
router.post("/signin", signIn);

export default router;
