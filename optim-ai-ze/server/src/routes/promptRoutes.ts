import { Router } from 'express';
import {
  getPrompts,
  getPrompt,
  createPrompt,
  updatePrompt,
  deletePrompt
} from '../controllers/promptController';

const router = Router();

// Get all prompts and create a new prompt
router.route('/')
  .get(getPrompts)
  .post(createPrompt);

// Get, update, and delete a specific prompt
router.route('/:id')
  .get(getPrompt)
  .put(updatePrompt)
  .delete(deletePrompt);

export default router; 