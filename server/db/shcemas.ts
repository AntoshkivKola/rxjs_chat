const mongoose = require("mongoose");

export interface IUser {
    name: string;
    color: string;
    login: string;
    password: string;
}

export const usersSchema: IUser = new mongoose.Schema({
    name: String,
    login: String,
    password: String,
    color: String,
});
