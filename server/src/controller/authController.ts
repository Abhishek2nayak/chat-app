import { Request, Response } from "express"
import { isValidEmail, isValidPassword } from "../utils/validator";
import { register, login } from '../services/authService';

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Email and Password are required" });

        if (!isValidEmail(email))
            return res.status(400).json({ error: "Invalid email address" });

        const { user, token } = await login(email, password);
        return res.status(200).json({ user, token });
    } catch (err: any) {
        return res.status(400).json({ error: err.message })
    }
}

export const registerController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        console.log(password)

        if (!name || !email || !password)
            return res.status(400).json({ error: "Please Filled Required Field" });

        if (!isValidEmail(email))
            return res.status(400).json({ error: "Invalid Email Address" });

        if (!isValidPassword(password))
            return res.status(400).json({ error: "Choose strong password" });

        const user = await register(name, email, password);

        if (!user)
            return res.status(400).json({ error: "Registration failed , try Again" });

        return res.status(200).json({ message: "Register Successfully", user : user });

    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
}