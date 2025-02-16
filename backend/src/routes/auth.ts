import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { verifyToken } from '../middleware/auth';

const router = express.Router()

const validators = [
    check("email", "Email is required").isEmail(),
    check("password", "password must be of 6 or more characters").isLength({ min: 6 })
]

router.post("/login", validators, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" });
        res.cookie("auth_token", token,
            { httpOnly: true, secure: process.env.NODE_ENV === "prodiction", maxAge: 86400000 }
        );
        return res.status(200).json({ userId: user._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

router.get("/validate-token", verifyToken, async (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId })
});

router.post("/logout", async (req: Request, res: Response) => {
    res.cookie("auth_token", "", { expires: new Date(0) });
    res.send();
});

export default router;