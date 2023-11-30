import { check, ValidationChain } from 'express-validator'

export const validateCreateProduct: ValidationChain[] = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters long'),
  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 1 })
    .withMessage('Price must be a positive number greater than 0'),
]

export const validateUpdateProduct: ValidationChain[] = [
  check('title')
    .optional()
    .trim()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('product name must have at least 3 - 200 characters long'),
  check('price')
    .optional()
    .trim()
    .withMessage('price is required')
    .isFloat({ min: 1 })
    .withMessage('price must be a positive number'),
]
