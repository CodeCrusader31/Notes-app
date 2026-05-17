import { Router } from "express";

import {
  create,
  favorite,
  getNote,
  getNotes,
  pin,
  remove,
  restore,
  share,
  update,
  versions,
} from "../controllers/note.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createNoteValidation,
  listNotesValidation,
  noteIdValidation,
  shareNoteValidation,
  toggleFavoriteValidation,
  togglePinValidation,
  updateNoteValidation,
} from "../validations/note.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", listNotesValidation, validateRequest, getNotes);
router.post("/", createNoteValidation, validateRequest, create);
router.get("/:noteId", noteIdValidation, validateRequest, getNote);
router.patch("/:noteId", updateNoteValidation, validateRequest, update);
router.delete("/:noteId", noteIdValidation, validateRequest, remove);
router.patch("/:noteId/restore", noteIdValidation, validateRequest, restore);
router.post("/:noteId/share", shareNoteValidation, validateRequest, share);
router.patch("/:noteId/favorite", toggleFavoriteValidation, validateRequest, favorite);
router.patch("/:noteId/pin", togglePinValidation, validateRequest, pin);
router.get("/:noteId/versions", noteIdValidation, validateRequest, versions);

export default router;
