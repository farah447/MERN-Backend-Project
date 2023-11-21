import { Request, Response, NextFunction } from "express";
import { Users } from "../models/userSchema";
import { IUser, UserInput } from "../types/types";


export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    try{
    const users: IUser [] = await Users.find()
    res.status(200).send({
        message: 'all users are returend',
        payload: users
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
      const userName = req.params.userName;
      const user = await Users.find({ userName: userName});
      if (!user) {
        throw new Error(`user not found with this user name ${userName}`)
      }
      res.status(200).json ({
        message: `get single user with user name ${userName}`,
        payload: user
    }) 
    } catch (error){
      next(error)
    }
  };

  export const createSingleUser = async (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) =>{
    try{
    const {
        firstName,
        lastName,
        userName,
        email,
        password
    } = req.body;
    const user ={ 
        firstName,
        lastName,
        userName,
        email,
        password};
        await new Users(user).save()
    res.status(201).json ({
        message: 'user is added'
    })
}catch (error){
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
      const user = await Users.findOneAndDelete({userName: userName});
      if (!user) {
        throw new Error(`user not found with this user name ${userName}`)
      }
      res.status(200).json ({
        message: `delete user with user name ${userName}`,
    }) 
    } catch (error){
      next(error)
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
      const user = await Users.findOneAndUpdate({userName: userName}, userUpdated, {
        new: true,
      });
      if (!user){
        throw new Error(`User not found with this user name ${userName}`)
      } 
      res.status(200).json ({
        message: `update user with user name ${userName}`,
        payload: user
    }) 
    return;
    } catch (error){
      next(error)
    }
  };