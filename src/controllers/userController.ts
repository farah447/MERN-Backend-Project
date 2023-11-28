import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import mongoose from "mongoose";

import { Users } from "../models/userSchema";
import { UserInput } from "../types/userTypes";
import {
    allUser,
    banUserByUserName,
    createUser,
    getUser,
    sendToken,
    unbanUserByUserName,
    userActivate
} from "../services/userServices";
import { createHttpError } from "../util/createHTTPError";
import { deleteImage } from "../helper/deleteImageHelper";



export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const register = await sendToken(req, res, next)

        res.status(200).json({
            message: 'check your Email to activate your account',
            token: register,
        })
    } catch (error) {
        next(error)
    }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        await userActivate(req)

        res.status(201).json({
            message: 'User registration successful',
        })

    } catch (error) {
        if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
            const errorMessage = error instanceof TokenExpiredError ? 'expired token' : 'Invalid token'
            next(Error(errorMessage))
        } else {
            next(error)
        }
    }
}

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await banUserByUserName(req)

        res.status(200).send({
            message: 'banned the user',
        })
    } catch (error) {
        next(error)
    }
}

export const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await unbanUserByUserName(req)

        res.status(200).send({
            message: 'unbanned the user',
        })
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        let page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        let search = req.query.search as string

        // const result = await allUser(search)
    
        const regExpSearch = new RegExp('.*' + search + '.*', 'i')
        const filter = {
          $or: [{ firstName: { $regex: regExpSearch } }, { email: { $regex: regExpSearch } }],
        }

        const count = await Users.countDocuments();
        const totalPages = Math.ceil(count / limit);

        if (page > totalPages) {
            page = totalPages;
        }
        const skip = (page - 1) * limit;
        const users = await Users.find(filter).skip(skip).limit(limit);
        res.status(200).send({
            message: 'all users are returend',
            payload: {
                users,
                currentPage: page,
                totalPages,
                

            }
        });
    } catch (error) {
        next(error)
    }
};

export const getSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const user = await getUser(req)
        const userName = req.params.userName;
        res.status(200).json({
            message: `get single user with user name ${userName}`,
            payload: user
        })
    } catch (error) {
        next(error)
    }
};

export const createSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const newUser = await createUser(req)
        res.status(201).json({
            message: 'user is added'
        })
    } catch (error) {
        next(error)
    }
};

export const deleteSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userName = req.params.userName;
        const user = await Users.findOneAndDelete({ userName: userName });
        if (!user) {
            throw new Error(`user not found with this user name ${userName}`)
        }
        if (user && user.image) {
            await deleteImage(user.image);
        }
        res.status(200).json({
            message: `delete user with user name ${userName}`,
        })
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const error = createHttpError(400, "Id format is not valid");
            next(error);
        } else {
            next(error);
        }
    }
};

export const updateSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userName = req.params.userName;
        const userUpdated: UserInput = req.body;
        const user = await Users.findOneAndUpdate({ userName: userName }, userUpdated, {
            new: true,
        });
        if (!user) {
            throw new Error(`User not found with this user name ${userName}`)
        }
        res.status(200).json({
            message: `update user with user name ${userName}`,
            payload: user
        })
        return;
    } catch (error) {
        next(error)
    }
};

