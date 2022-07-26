import {Users} from './models';


export const seedUsers = async () => {
    const bob = new Users({
        name: 'Bob',
        color: 'red',
        login: 'bob',
        password: 'bob'
    });

    const alice = new Users({
        name: 'Alice',
        color: 'blue',
        login: 'alice',
        password: 'alice'
    });

    const john = new Users({
        name: 'John',
        color: 'green',
        login: 'john',
        password: 'john'
    });

    bob.save();
    alice.save();
    john.save();
}

