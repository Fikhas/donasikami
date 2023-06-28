const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Account = mongoose.model('Account', accountSchema)

const articleSchema = new mongoose.Schema({
    author: {
        type: mongoose.ObjectId,
        ref: Account
    },
    image: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Donatur = mongoose.model('Donatur', {
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },
    stuffType: {
        type: String,
        required: true
    },
    conditionType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Article = mongoose.model('Article', articleSchema)

// const contact1 = new Contact({
//     nama: 'Rifqi',
//     noHP: '087109274018',
//     email: 'rifqiy@gmail.com'
// });

// contact1.save().then((contact) => console.log(contact));

module.exports = {Donatur, Account, Article}