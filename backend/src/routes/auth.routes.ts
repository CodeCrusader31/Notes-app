import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { loginValidation, registerValidation } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);

export default router;
