const mongoose = require("mongoose");

export interface IMessage {
    text: string;
    data: string;
    _id: string;
}

export interface IUser {
    name: string;
    color: string;
    login: string;
    password: string;
    _id: string;
}

export interface IGroup {
    _id: string;
    name: string;
    members: any[];
    owner_id: string;
}

export const usersSchema: IUser = new mongoose.Schema({
    name: String,
    login: String,
    password: String,
    color: String,
});


export const groupsSchema: IGroup = new mongoose.Schema({
    name: String,
    members: [{
        type: mongoose.Schema.ObjectId,
        required: true,
    }],
    owner_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Users",
    }
})

export const massagesSchema: IMessage = new mongoose.Schema({
    text: String,
    data: String,
    group_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Groups",
        required: true,
    },
    author_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Users",
    }
});

