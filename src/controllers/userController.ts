import { NextFunction, Request, Response } from 'express'

import { Users } from '../models/userSchema'
import { UserInput } from '../types/userTypes'

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3

    const count = await Users.countDocuments()
    const totalPages = Math.ceil(count / limit)

    if (page > totalPages) {
      page = totalPages
    }
    const skip = (page - 1) * limit
    const users = await Users.find().skip(skip).limit(limit)
    res.status(200).send({
      message: 'All users are returend',
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
    const userName = req.params.userName
    const user = await Users.find({ userName: userName })
    if (!user) {
      throw new Error(`User not found with this user name ${userName}`)
    }
    res.status(200).json({
      message: `Get single user with user name ${userName}`,
      payload: user,
    })
  } catch (error) {
    next(error)
  }
}

export const createSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body
    const user = {
      firstName,
      lastName,
      userName,
      email,
      password,
    }
    await new Users(user).save()
    res.status(201).json({
      message: 'User is added',
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
      throw new Error(`User not found with this user name ${userName}`)
    }
    res.status(200).json({
      message: `Delete user with user name ${userName}`,
    })
  } catch (error) {
    next(error)
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
      throw new Error(`User not found with this user name ${userName}`)
    }
    res.status(200).json({
      message: `Update user with user name ${userName}`,
      payload: user,
    })
    return
  } catch (error) {
    next(error)
  }
}
