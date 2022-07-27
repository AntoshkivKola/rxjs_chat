import {usersSchema} from "./shcemas";
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo-db:27017/test');

export const Users = mongoose.model('Users', usersSchema);



