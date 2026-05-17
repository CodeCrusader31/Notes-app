import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("password")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("A valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];
