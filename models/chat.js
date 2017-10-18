const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const arrayUniquePlugin = require('mongoose-unique-array');

    const ChatSchema = new mongoose.Schema({

        //newMessage implies a new room must be created, will create a new ChatRoomModel, store members, created, and all messages.
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true
        },
        created: {
            type: Number,
            required: true
        },
        members: {
            type: [{type: mongoose.Schema.Types.ObjectId, ref:'User', unique:true}],
            unique: true,
            required: true

        },
        messages: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Messages',
            unique: true,
            required: true
        }
    });

ChatSchema.plugin(arrayUniquePlugin);

//validate and save, called in that order and first on children then on the parent
// ChatSchema.pre('validate', function(next){
//     next();
// });
//
// ChatSchema.pre('save', function(next) {
//     next();
// });

class Message {

    constructor(from, to, message, timestamp) {
        this.from = from;
        this.to = to;
        this.message = message;
        this.timestamp = timestamp;
    }
}

const Messages = mongoose.model('Messages', {
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true
    },

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
                message: {
                    type: String
                },
                timestamp: {
                    type: Number
                }
            }
        ]

});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = {Chat, Messages, Message};