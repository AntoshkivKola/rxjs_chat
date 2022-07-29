import {Users, Groups, Massages} from './models';


export const seedUsers = async () => {
    const bob = await new Users({
        name: 'Bob',
        color: '#ff0000',
        login: 'bob',
        password: 'bob',
    });

    const alice = await new Users({
        name: 'Alice',
        color: '#00ff00',
        login: 'alice',
        password: 'alice',
    });

    const john = await new Users({
        name: 'John',
        color: '#0000ff',
        login: 'john',
        password: 'john',
    });

    const mainGroup = await new Groups({
        name: 'Main',
        members: [bob._id, alice._id, john._id],
    });

    const secondGroup = await new Groups({
        name: 'Second Group',
        members: [bob._id, john._id],
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
        {
            text: 'Hello',
            data: '7/28/2022, 0:00:00 PM',
            group_id: secondGroup._id,
            author_id: bob._id,
        },
        {
            text: '!',
            data: '7/28/2022, 0:00:01 PM',
            group_id: secondGroup._id,
            author_id: bob._id,
        },
        {
            text: 'Hi',
            data: '7/29/2022, 0:00:00 PM',
            group_id: secondGroup._id,
            author_id: john._id,
        },
    ]);

    bob.save();
    alice.save();
    john.save();
    mainGroup.save();
    secondGroup.save();
}

