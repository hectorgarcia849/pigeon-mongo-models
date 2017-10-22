const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const arrayUniquePlugin = require('mongoose-unique-array');

/*
References removed for time being as references cannot be using different instances of mongoose.
https://github.com/Automattic/mongoose/issues/2951
 */

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
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true},
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

module.exports = {Chat, ChatProfile, Messages, Message};