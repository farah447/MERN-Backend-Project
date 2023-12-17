import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { dev } from '../config'
import { handleSendEmail } from '../helper/sendEmail'
import { Users } from '../models/userSchema'
import { IUser } from '../types/userTypes'
import { createHttpError } from '../util/createHTTPError'

export const sendToken = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, userName, email, password } = req.body

  const isUserExists = await Users.exists({ email: email })

  if (isUserExists) {
    const error = createHttpError(404, 'This User is already exists')
    throw error
  }

  const tokenPayload = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: password,
  }

  const token = jwt.sign(tokenPayload, dev.app.jwtUserActivationKey, { expiresIn: '24h' })

  const emailData = {
    email: email,
    subject: 'Activate Your Account',
    html: `<h1>Hello ${firstName}</h1><p>Please activate your account by : <a href="http://localhost:3000/users/activate/${token}">click the following link</a></p>`,
  }
  await handleSendEmail(emailData)

  return token
}

export const userActivate = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body

  if (!token) {
    const error = createHttpError(404, 'please Provide a token link')
    throw error
  }

  const decoded = jwt.verify(token, dev.app.jwtUserActivationKey)

  if (!decoded) {
    const error = createHttpError(404, 'The Token link is Invalid ')
    throw error
  }
  await Users.create(decoded)
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const isUserExists = await Users.exists({ email: req.body.email })
  if (isUserExists) {
    const error = createHttpError(404, `User already exist with this email ${req.body.email}`)
    throw error
  }
  const userName = req.params.userName
  const user = await Users.find({ userName: userName })
  if (!user) {
    const error = createHttpError(404, `user not found with this user name ${userName}`)
    throw error
  }
  return user
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file
  const image = file?.path
  const { firstName, lastName, userName, email, password } = req.body
  const user = {
    firstName,
    lastName,
    userName,
    email,
    password,
    image,
  }
  await new Users(user).save()
}

export const allUser = async (search: string) => {
  const regExpSearch = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [{ title: { $regex: regExpSearch } }, { description: { $regex: regExpSearch } }],
  }

  const users = await Users.find(filter)

  return {
    users,
  }
}

export const updateBanStatusByUserName = async (
  userName: string,
  isBanned: boolean
): Promise<IUser | null> => {
  const update = { isBanned: !isBanned }
  const user = await Users.findOneAndUpdate({ userName: userName }, update, { new: true })

  if (!user) {
    const error = createHttpError(404, 'The User not found')
    throw error
  }
  return user
}
