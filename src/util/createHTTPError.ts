import { Error } from '../types/errorValidation'

export const createHttpError = (status: number, message: string) => {
  const error: Error = new Error()
  error.message = message
  error.status = status
  return error
}
