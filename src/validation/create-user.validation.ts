import { body } from 'express-validator';

export const validateUser = [
    body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];