
export interface IUser extends Document {
    // id: Number;
    firstName: String;
    lastName: String;
    userName: String;
    email: String;
    password: String;
}

export type UserInput = Omit<IUser, 'userName'>