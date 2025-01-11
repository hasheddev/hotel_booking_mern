import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from '../models/user';
import { verifyToken } from '../middleware/auth';

//666064ce6ecd28839d792d68
const router = express.Router()
const validators = [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "password must be of 6 or more characters").isLength({ min: 6 })
]


router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(400).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});

router.post('/register', validators, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        let user = await User.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).json({ message: "user already exists" });
        }
        user = new User(req.body);
        await user.save();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" });
        res.cookie("auth_token", token,
            { httpOnly: true, secure: process.env.NODE_ENV === "prodiction", maxAge: 86400000 }
        );
        return res.status(201).send({ message: "User registered sucessfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" });
    }
}); export default router;
