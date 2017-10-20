const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const arrayUniquePlugin = require('mongoose-unique-array');

const ChatSchema = new mongoose.Schema({
    created: {
        type: Number,
        required: true
    },
    members: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref:'User', unique: true}],
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

const ChatsSchema = new mongoose.Schema({
    owner: {
        type: {type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true}
    },
    chats: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat', unique: true}]
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
const Chats = mongoose.model('Chats', ChatsSchema);
const Messages = mongoose.model('Messages', MessagesSchema);

module.exports = {Chat, Chats, Messages, Message};