const mongoose = require('mongoose');
const { User, Thought } = require('../models');
const connection=require('../config/connection')

const users = [
    {
        username: 'bigKat',
        email: 'bigkat@gmail.com',
        friends:[
            {

            }
        ]
    },
    {
        username: 'madd',
        email: 'maddman@hotmail.com',
    },
    {
        username: 'raiden',
        email: 'raiden@yahoo.com',
    },
];

const thoughts = [
    {
            thoughtText: "thats sick",
            username: 'bigKat',
            reactions: [
        {
            reactionBody: 'cool',
            username: 'madd',
        },
        {
            reactionBody: 'that sucks',
            username: 'raiden',
        },
    ],
    },
{
    thoughtText: "kyle and drew are cool",
    username: 'madd',
    reactions: [
    {
        reactionBody: 'yea',
        username: 'bigKat',
        },
    ],
    },
{
    thoughtText: "Mongo sounds like mongolian.",
    username: 'raiden',
    reactions: [
    {
        reactionBody: 'I concur.',
        username: 'bigKat',
    },
    ],
    },
];
//Friends map
const friendsMapping = {
    bigKat: ['madd', 'raiden'],
    madd: ['bigKat'],
    raiden: ['bigKat'],
  };

//seed the database
async function seedDatabase() {
    await connection.once('open', async () => {
// Clear db
        await User.deleteMany();
        await Thought.deleteMany();

// Insert users
    const createdUsers = await User.insertMany(users);

// Map username to userId
    const userMap = {};
    createdUsers.forEach(user => {
    userMap[user.username] = user._id;
    });

// Insert thoughts with user references
    for (const thought of thoughts) {
        const newThought = await Thought.create({
            thoughtText: thought.thoughtText,
            username: thought.username,
            reactions: thought.reactions,
    });

// Add thought to the user's thoughts array
await User.findByIdAndUpdate(
    userMap[thought.username],
    { $push: { thoughts: newThought._id } },
    { new: true }
    );
}
for (const username in friendsMapping) {
    const friendIds = friendsMapping[username].map(friendUsername => userMap[friendUsername]);
    await User.findByIdAndUpdate(
        userMap[username],
        { $addToSet: { friends: { $each: friendIds } } },
        { new: true }
    );
}

    console.log('Database seeded successfully');
    mongoose.connection.close();
    });
}

seedDatabase().catch(err => {
console.error(err);
mongoose.connection.close();
});
