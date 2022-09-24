const mongoose = require(`mongoose`);
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

var classRoomSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },

        tutor: {
            type: ObjectId,
            ref: "User",
            required: true,
            trim: true,
        },

        students: {
            type: Array,
            ref: "User",
            default: [],
            // select: false,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model(`ClassRoom`, classRoomSchema);
