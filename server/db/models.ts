import {usersSchema} from "./shcemas";
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

export const Users = mongoose.model('Users', usersSchema);



