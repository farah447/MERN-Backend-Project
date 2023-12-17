import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import mongoose from 'mongoose'

import { deleteImage } from '../helper/deleteImageHelper'
import { Users } from '../models/userSchema'
import {
  createUser,
  getUser,
  sendToken,
  updateBanStatusByUserName,
  userActivate,
} from '../services/userServices'
import { UserInput } from '../types/userTypes'
import { createHttpError } from '../util/createHTTPError'
import { dev } from '../config'

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
    await userActivate(req, res, next)

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

export const updateBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const user = await Users.findOne({ userName: userName })
    if (!user) {
      const error = createHttpError(404, `user not found with this user name ${userName}`)
      throw error
    }
    await updateBanStatusByUserName(userName, user.isBanned)

    res.status(200).send({
      message: 'User status is updated',
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    let search = req.query.search as string
    let filter = {}
    if (search) {
      const regExpSearch = new RegExp('.*' + search + '.*', 'i')
      filter = {
        $or: [{ firstName: { $regex: regExpSearch } }, { email: { $regex: regExpSearch } }],
      }
    }

    const count = await Users.countDocuments()
    const totalPages = Math.ceil(count / limit)

    if (page > totalPages) {
      page = totalPages
    }
    const skip = (page - 1) * limit
    const users = await Users.find(filter).populate('orders').skip(skip).limit(limit)

    res.status(200).send({
      message: 'all users are returend',
      payload: {
        users,
        currentPage: page,
        totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req, res, next)
    const userName = req.params.userName
    res.status(200).json({
      message: `get single user with user name ${userName}`,
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

export const createSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await createUser(req, res, next)
    res.status(201).json({
      message: 'user is added',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const user = await Users.findOneAndDelete({ userName: userName })
    if (!user) {
      const error = createHttpError(404, `User not found with this user name ${userName}`)
      throw error
    }
    if (user && user.image) {
      await deleteImage(user.image)
    }
    res.status(200).json({
      message: `delete user with user name ${userName}`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'Id format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const updateSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userName = req.params.userName
    const userUpdated: UserInput = req.body
    const user = await Users.findOneAndUpdate({ userName: userName }, userUpdated, {
      new: true,
    })
    if (!user) {
      const error = createHttpError(404, `User not found with this user name ${userName}`)
      throw error
    }
    res.status(200).json({
      message: `update user with user name ${userName}`,
      payload: user,
    })
    return
  } catch (error) {
    next(error)
  }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await Users.exists({ email: email })
    if (!user) {
      const error = createHttpError(404, 'User not exists with this email. Please register first.')
      throw error
    }

    const token = jwt.sign({ email }, dev.app.jwtUserActivationKey, {
      expiresIn: '15m',
    });

    const emailData = {
      email: email,
      subject: 'Reset Password',
      html: `
      <h1>Hello ${name}</h1>
      <p>please click here to: <a href="http://localhost:3000/users/activate/${token}">Reset passowrd</a></p>`
    }

    res.status(200).json({
      message: 'please check your email to reset password ',
      payload: token,
    })
  } catch (error) {
    next(error)
  }
}