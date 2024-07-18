import { Request, Response } from 'express';
import UserService from '../services/home.service';
import { handleValidationErrors } from '../validation';
import { validateUser } from '../validation/create-user.validation';

export const home = async (req: Request, res: Response) => {
  try {
    await Promise.all(validateUser.map(validation => validation.run(req)));

    const users = await UserService.getUsers();
    res.status(201).json({ message: users });
  } catch (error) {
    res.status(400).json({ error });
  }
};
export const homeController = [...validateUser, handleValidationErrors, home];

export const about = async (req: Request, res: Response) => {
  const users = await UserService.getUsers();
  
  res.status(200).json(users);
};
export const homeAboutController = [about];

