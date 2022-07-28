import {usersSchema, massagesSchema, groupsSchema} from "./shcemas";
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo-db:27017/test');

export const Users = mongoose.model('Users', usersSchema);
export const Massages = mongoose.model('Massage', massagesSchema);
export const Groups = mongoose.model('Groups', groupsSchema);


