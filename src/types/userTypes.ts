import { Document } from 'mongoose'

export interface IUser extends Document {
    _id: Number;
    firstName: String;
    lastName: String;
    userName: String;
    email: String;
    password: String;
    isAdmin: Boolean;
}

export type EmailDataType = {
    email: string
    subject: string
    html: string
  }

export type UserInput = Omit<IUser, 'userName'>