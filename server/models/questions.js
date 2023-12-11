// Question Document Schema
const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 100},
    text: {type: String, required: true},
    tags:  [{type: mongoose.Schema.Types.ObjectId, maxLength: 5, ref: 'tags'}],
    asked_by: {type: String, required: true},
    ask_date_time: {type: Date, default: Date.now},
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'answers'}],
    views: {type: Number, default: 0},
    // Add a virtual field to rename "_id" to "qid"
    qid: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () {
            return this._id; // Set default value to current _id
        },
        virtual: true
    },
    votes: {type: Number, default: 0},
    upvoteBy: [{type: String}],
    downvoteBy: [{type: String}],
    pinnedAnswer: { type: mongoose.Schema.Types.ObjectId },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}],
    last_ask_date_time: {type: Date, default: Date.now}
});

const questionsModel = mongoose.model("questions", questionsSchema);

module.exports = questionsModel;
