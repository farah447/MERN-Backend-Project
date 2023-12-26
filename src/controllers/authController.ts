import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

import { Users } from '../models/userSchema'
import { createHttpError } from '../util/createHTTPError'

import generateToken from '../util/generateToken'
// import {accessToken} form './'
// export const ACCESS_KEY = 'farah'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const accessToken = req.cookies.access_token

    const { email, password } = req.body

    const user = await Users.findOne({ email: email })

    if (!user) {
      throw createHttpError(404, 'User not found with this email')
    }

    console.log(user)

    const isPasswordMatch = await bcrypt.compare(password, String(user.password))
    if (!isPasswordMatch) {
      throw createHttpError(401, "Password doesn't match")
    }

    if (user.isBanned) {
      throw createHttpError(403, 'User is banned, please contact support')
    }
    // const accessToken = jwt.sign({ _id: user._id }, ACCESS_KEY, { expiresIn: '20m' })

    // res.cookie('access_token', accessToken, {
    //   maxAge: 15 * 60 * 1000, //15 minutes
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true
    // })

    res.cookie('access_token', generateToken(String(user._id)), {
      maxAge: 15 * 60 * 1000, //15 minutes
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })


    //res.status(200).send({ message: 'User is logged in', payload: user })
    if (user.isAdmin) {
      res.status(200).send({ message: 'Admin is logged in', payload: user })
    } else {
      res.status(200).send({ message: 'User is logged in', payload: user })
    }
  } catch (error) {
    next(error)
  }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')
    res.status(200).send({ message: 'User is logged out' })
  } catch (error) {
    next(error)
  }
}
