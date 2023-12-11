// Answer Document Schema
const mongoose = require("mongoose");

const answersSchema = new mongoose.Schema({
    text: {type: String, required: true},
    ans_by: {type: String, required: true},
    ans_date_time: {type: Date, default: Date.now},
    // Add a virtual field to rename "_id" to "qid"
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () {
            return this._id;
        },
        virtual: true
    },
    votes: {type: Number, default: 0},
    upvoteBy: [{type: String}],
    downvoteBy: [{type: String}],
    comments: [{type: mongoose.Schema.Types.ObjectId}]
});

const answersModel = mongoose.model("answers", answersSchema);

module.exports = answersModel;
