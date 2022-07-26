const mongoose = require("mongoose");

export interface IMessage {
    text: string;
    data: string;
}

export interface IUser {
    name: string;
    color: string;
    login: string;
    password: string;
    messages: IMessage[];
}

export const usersSchema: IUser = new mongoose.Schema({
    name: String,
    login: String,
    password: String,
    color: String,
    messages: [{
        text: String,
        data: String
    }]
});
