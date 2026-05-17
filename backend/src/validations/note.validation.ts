import { body, param, query } from "express-validator";

export const noteIdValidation = [
  param("noteId").isMongoId().withMessage("A valid note id is required"),
];

export const listNotesValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("search").optional().isString().trim().isLength({ max: 100 }),
  query("tag").optional().isString().trim().isLength({ max: 50 }),
  query("isFavorite").optional().isBoolean().withMessage("isFavorite must be boolean"),
  query("isPinned").optional().isBoolean().withMessage("isPinned must be boolean"),
  query("includeDeleted").optional().isBoolean().withMessage("includeDeleted must be boolean"),
];

export const createNoteValidation = [
  body("title").isString().trim().isLength({ min: 1, max: 160 }).withMessage("title is required"),
  body("content").isString().trim().isLength({ min: 1, max: 20000 }).withMessage("content is required"),
  body("tags").optional().isArray({ max: 20 }).withMessage("tags must be an array"),
  body("tags.*").optional().isString().trim().isLength({ min: 1, max: 50 }),
  body("isFavorite").optional().isBoolean(),
  body("isPinned").optional().isBoolean(),
];

export const updateNoteValidation = [
  ...noteIdValidation,
  body("title").optional().isString().trim().isLength({ min: 1, max: 160 }),
  body("content").optional().isString().trim().isLength({ min: 1, max: 20000 }),
  body("tags").optional().isArray({ max: 20 }),
  body("tags.*").optional().isString().trim().isLength({ min: 1, max: 50 }),
  body("isFavorite").optional().isBoolean(),
  body("isPinned").optional().isBoolean(),
];

export const shareNoteValidation = [
  ...noteIdValidation,
  body("email").isEmail().normalizeEmail().withMessage("A valid user email is required"),
];

export const toggleFavoriteValidation = [
  ...noteIdValidation,
  body("isFavorite").isBoolean().withMessage("isFavorite must be boolean"),
];

export const togglePinValidation = [
  ...noteIdValidation,
  body("isPinned").isBoolean().withMessage("isPinned must be boolean"),
];
