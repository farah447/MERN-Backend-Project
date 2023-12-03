import { ValidationChain, check } from 'express-validator'

export const validateCreateCategory: ValidationChain[] = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Category title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Category title must be between 3 and 200 characters long'),
]
