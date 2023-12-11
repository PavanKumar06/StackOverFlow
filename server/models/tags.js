// Tag Document Schema
const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 20},
    // Add a virtual field to rename "_id" to "tid"
    tid: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () {
            return this._id; // Set default value to current _id
        },
        virtual: true
    },
    tag_by: {type: String, required: true}
});
 
const tagsModel = mongoose.model("tags", tagsSchema);
 
module.exports = tagsModel;
