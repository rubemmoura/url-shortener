import express, { Request, Response } from 'express';
import AuthController from '../controllers/AuthController';
import { AuthenticationUserValidator } from '../validators/authenticationUserValidator';
import { DeleteUserValidator } from '../validators/deleteUserValidator';
import { LogoutValidator } from '../validators/logoutValidator';
import { RegisterUserValidator } from '../validators/registerUserValidator';
import { VerifyTokenValidator } from '../validators/verifyTokenValidator';

const router = express.Router();
const authController = new AuthController();
const jwtSecret = process.env.JWT_SECRET || '';

router.post('/register', RegisterUserValidator.validate, async (req: Request, res: Response) => {
    await authController.registerUser(req, res);
});

router.delete('/delete', DeleteUserValidator.validate, async (req: Request, res: Response) => {
    await authController.deleteUser(req, res);
});

router.post('/login', AuthenticationUserValidator.validate, async (req: Request, res: Response) => {
    await authController.loginUser(req, res);
});

router.post('/verify-token', VerifyTokenValidator.validate, async (req: Request, res: Response) => {
    await authController.verifyToken(req, res);
});

router.post('/logout', LogoutValidator.validate, async (req: Request, res: Response) => {
    await authController.logoutUser(req, res);
});

export default router;
