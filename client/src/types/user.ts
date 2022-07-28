export interface IMessage {
    text: string;
    date: string;
    author_id: string;
    group_id: string;
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
    members: string[];
}
