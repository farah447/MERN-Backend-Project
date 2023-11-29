import jwt from 'jsonwebtoken'

import { dev } from '../config'

const generateToken = (id: string) => {
  return jwt.sign({ id }, dev.app.jwtAccessKey, {
    expiresIn: '3h',
  })
}

export default generateToken
