const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const arrayUniquePlugin = require('mongoose-unique-array');

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => { return validator.isEmail(value)},
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type: String,
        require: true,
        minlength: 6
    }
});

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    return jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
};

UserSchema.methods.toJSON = function () {
    //prevents password and tokens from being revealed
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);

};

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

UserSchema.pre('save', function(next) {
    const user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

const Profile = mongoose.model('Profile',
    {
        _owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            minlength: 1,
            unique: true,
            trim: true
        },
        firstName: {
            type: String,
            minlength: 1,
            trim: true
        },
        lastName: {
            type: String,
            minlength: 1,
            trim: true
        },
        created: {
            type: Number,
            required: true
        },
        descriptors: [{type:String}],
        locationTimes:[
            {
                country: String,
                city: String,
                place: String,
                fromDate: Number,
                toDate: Number
            }]
    }
);

const Pigeon = mongoose.model('Pigeon',
    {
        _creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        body: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        created: {
            type: Number,
            required: true
        },
        encounterDate: {
            type: Number,
            required: true
        },
        from: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: 50,
            trim: true
        },
        to: {
            type: String,
            required: true
        }
    }
);

const ChatSchema = new mongoose.Schema({
    created: {
        type: Number,
        required: true
    },
    members: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true}],
        unique: true,
        required: true

    },
    messages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
        unique: true
    }
});

ChatSchema.plugin(arrayUniquePlugin);

const ChatProfileSchema = new mongoose.Schema({
    _owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true,
        required: true
    },
    chats: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat', unique: true}],
        require: true
    }
});


class Message {

    constructor(from, to, message, timestamp) {
        this.from = from;
        this.to = to;
        this.message = message;
        this.timestamp = timestamp;
    }
}

const MessagesSchema = mongoose.Schema({
    messages:
        [
            {
                from: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                to: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                message: String,
                timestamp: Number
            }
        ]

});

const Chat = mongoose.model('Chat', ChatSchema);
const ChatProfile = mongoose.model('ChatProfile', ChatProfileSchema);
const Messages = mongoose.model('Messages', MessagesSchema);

module.exports = {User, Pigeon, Profile, Chat, ChatProfile, Messages, Message};
