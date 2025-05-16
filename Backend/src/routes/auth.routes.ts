    import { Router } from "express";
    import { signUp, signIn } from "../controllers/auth.controller";
    import { validateSignUp } from "../middlewares/validateUser";
    import { requestPasswordReset, resetPassword } from "../controllers/auth.controller";
    import { logout } from "../controllers/auth.controller";
    import authenticateToken from "../middlewares/authenticateToken";
    import { testEmail } from "../controllers/auth.controller";

    const router = Router();


    router.post("/logout", authenticateToken, logout);

    router.post("/signup", validateSignUp, signUp);
    router.post("/signin", signIn);

    router.post("/reset-password-request", requestPasswordReset);
    router.post("/reset-password", resetPassword);

    router.post("/test-email", testEmail);

    export default router;
