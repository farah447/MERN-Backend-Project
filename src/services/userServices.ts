import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

import { Users } from "../models/userSchema"
import { dev } from "../config";
import { handleSendEmail } from "../helper/sendEmail";

export const sendToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { firstName, lastName, userName, email, password } = req.body

    const isUserExists = await Users.exists({ email: email })

    if (isUserExists) {
        throw Error('User already exists')
    }

    const tokenPayload = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: password,
    }

    const token = jwt.sign(
        tokenPayload,
        dev.app.jwtUserActivationKey,
        { expiresIn: '24h' })

    const emailData = {
        email: email,
        subject: 'Activate Your Account',
        html: `<h1>Hello ${firstName}</h1><p>Please activate your account by : <a href="http://localhost:3003/users/activate/${token}">click the following link</a></p>`,
    }
    await handleSendEmail(emailData)

    return token;
}


export const userActivate = async (req: Request) => {
    const token = req.body.token

    if (!token) {
        throw Error('please Provide a token')
    }

    const decoded = jwt.verify(token, dev.app.jwtUserActivationKey)

    if (!decoded) {
        throw Error('Token is Invalid ')
    }
    await Users.create(decoded)
}

export const getUser = async (req: Request) => {

    const isUserExists = await Users.exists({ email: req.body.email })
    if (isUserExists) {
        throw Error(`User already exist with the email ${req.body.email}`)
    }
    const userName = req.params.userName;
    const user = await Users.find({ userName: userName });
    if (!user) {
        throw new Error(`user not found with this user name ${userName}`)
    }
    return user;
}

export const createUser = async (req: Request) => {
    const {
        firstName,
        lastName,
        userName,
        email,
        password
    } = req.body;
    const user = {
        firstName,
        lastName,
        userName,
        email,
        password
    };
    await new Users(user).save()
}
