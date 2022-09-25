const mongoose = require(`mongoose`);
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

var fileSchema = new Schema(
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

        filepath: {
            type: String,
            required: true,
            trim: true,
        },

        filetype: {
            type: String,
            required: true,
            enum: [`AUDIO`, `VIDEO`, `IMAGE`, `URL`],
            trim: true,
        },

        uploaded_by: {
            type: ObjectId,
            ref: `User`,
            required: true,
            trim: true,
        },

        classroom: {
            type: ObjectId,
            ref: `ClassRoom`,
            required: true,
            trim: true,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model(`File`, fileSchema);
