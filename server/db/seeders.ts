import {Users, Groups, Massages} from './models';


export const seedUsers = async () => {
    const bob = await new Users({
        name: 'Bob',
        color: 'red',
        login: 'bob',
        password: 'bob',
    });

    const alice = await new Users({
        name: 'Alice',
        color: 'blue',
        login: 'alice',
        password: 'alice',
    });

    const john = await new Users({
        name: 'John',
        color: 'green',
        login: 'john',
        password: 'john',
    });

    const mainGroup = await new Groups({
        name: 'Main',
        members: [bob._id, alice._id, john._id],
    });

    await Massages.collection.insertMany([
        {
            text: 'Hello',
            data: '7/28/2022, 0:00:00 PM',
            group_id: mainGroup._id,
            author_id: alice._id,
        },
        {
            text: 'Hello',
            data: '7/28/2022, 0:00:00 PM',
            group_id: mainGroup._id,
            author_id: bob._id,
        },
        {
            text: 'Hello 2',
            data: '7/28/2022, 0:00:01 PM',
            group_id: mainGroup._id,
            author_id: bob._id,
        },
        {
            text: 'Hello',
            data: '7/28/2022, 0:00:00 PM',
            group_id: mainGroup._id,
            author_id: john._id,
        },
    ]);

    bob.save();
    alice.save();
    john.save();
    mainGroup.save();
}

