import { Request, Response, NextFunction } from 'express';
import { Prompt } from '../models/Prompt';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Get all prompts for a user
 * @route GET /api/prompts
 */
export const getPrompts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    
    const prompts = await Prompt.find({ userId }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: prompts.length,
      data: {
        prompts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single prompt
 * @route GET /api/prompts/:id
 */
export const getPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    
    const prompt = await Prompt.findOne({ _id: id, userId });
    
    if (!prompt) {
      throw new NotFoundError(`No prompt found with id ${id}`);
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        prompt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new prompt
 * @route POST /api/prompts
 */
export const createPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    
    const { title, description, content, ruleIds } = req.body;
    
    if (!title || !content) {
      throw new BadRequestError('Title and content are required');
    }
    
    const prompt = await Prompt.create({
      title,
      description,
      content,
      ruleIds: ruleIds || [],
      userId,
    });
    
    logger.info(`Prompt created: ${prompt.id}`, { userId });
    
    res.status(201).json({
      status: 'success',
      data: {
        prompt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a prompt
 * @route PUT /api/prompts/:id
 */
export const updatePrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    
    const { title, description, content, ruleIds } = req.body;
    
    // Find the prompt first to check ownership
    const existingPrompt = await Prompt.findOne({ _id: id, userId });
    
    if (!existingPrompt) {
      throw new NotFoundError(`No prompt found with id ${id}`);
    }
    
    // Update the prompt
    const prompt = await Prompt.findByIdAndUpdate(
      id,
      {
        title,
        description,
        content,
        ruleIds,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    
    logger.info(`Prompt updated: ${id}`, { userId });
    
    res.status(200).json({
      status: 'success',
      data: {
        prompt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a prompt
 * @route DELETE /api/prompts/:id
 */
export const deletePrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    
    // Find the prompt first to check ownership
    const prompt = await Prompt.findOne({ _id: id, userId });
    
    if (!prompt) {
      throw new NotFoundError(`No prompt found with id ${id}`);
    }
    
    await Prompt.findByIdAndDelete(id);
    
    logger.info(`Prompt deleted: ${id}`, { userId });
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 