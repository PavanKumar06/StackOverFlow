// Comment Document Schema
const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    // Add a virtual field to rename "_id" to "cid"
    cid: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () {
            return this._id; // Set default value to current _id
        },
        virtual: true
    },
    comment_by: {type: String, required: true},
    com_date_time: {type: Date, default: Date.now},
});
 
const commentsModel = mongoose.model("comments", commentsSchema);
 
module.exports = commentsModel;