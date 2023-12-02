import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { dev } from '../config'
import { Users } from '../models/userSchema'
import { createHttpError } from '../util/createHTTPError'

export interface CustomRequest extends Request {
  userId?: string
}

export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token

    if (!accessToken) {
      throw createHttpError(401, 'You are not logged in')
    }

    const decoded = (await jwt.verify(accessToken, dev.app.jwtAccessKey)) as JwtPayload
    if (!decoded) {
      throw createHttpError(401, 'Invalied access token')
    }

    req.userId = decoded.id

    next()
  } catch (error) {
    next(error)
  }
}

export const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token
    if (accessToken) {
      throw createHttpError(401, 'You are already logged in')
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findById(req.userId)
    if (!user) {
      throw new Error(`user not found with this user id ${user}`)
    }
    if (user.isAdmin) {
      next()
    } else {
      throw createHttpError(403, 'You are not admin')
    }
  } catch (error) {
    next(error)
  }
}
