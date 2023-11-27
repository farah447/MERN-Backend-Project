import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

import { Users } from "../models/userSchema";
import { createHttpError } from "../util/createHTTPError";
import { dev } from "../config";

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email });

        if (!user) {
            throw createHttpError(404, "User not found with this email");
        }

        const isPasswordMatch = await bcrypt.compare(password, String(user.password));
        if (!isPasswordMatch) {
            throw createHttpError(401, "Password doesn't match");
        }

        if (user.isBanned) {
            throw createHttpError(403, "user is banned, please contact support");
        }

        const accessToken = JWT.sign({ _id: user._id }, dev.app.jwtAccessKey, { expiresIn: '1m' });

        res.cookie('access_token', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
        })

        res.send({ message: "user is logged in", payload: user });
    } catch (error) {
        next(error);
    }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token');
        res.send({ message: "user is logged out" });
    } catch (error) {
        next(error);
    }
}