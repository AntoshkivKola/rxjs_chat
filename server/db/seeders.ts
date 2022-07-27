import {Users} from './models';


export const seedUsers = () => {
    const bob = new Users({
        name: 'Bob',
        color: 'red',
        login: 'bob',
        password: 'bob',
        messages: [],
    });

    const alice = new Users({
        name: 'Alice',
        color: 'blue',
        login: 'alice',
        password: 'alice',
        messages: [],
    });

    const john = new Users({
        name: 'John',
        color: 'green',
        login: 'john',
        password: 'john',
        messages: [{
            text: 'Hello',
            data: '2022-07-26T12:00:00.000Z',
        },
        {
            text: 'World',
            data: '2022-07-27T12:00:00.000Z',
        },
        {
            text: 'Hi!',
            data: '2022-06-27T12:00:00.000Z',
        }],
    });

    bob.save();
    alice.save();
    john.save();
}

