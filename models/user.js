const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const crypto = require(`crypto`);
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
var userSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        lastname: {
            type: String,
            // required: true,
            maxlength: 32,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        role: {
            type: String,
            enum: [`student`, `tutor`],
            default: `student`,
        },
        password: {
            type: String,
            required: true,
        },
        classrooms: [
            {
                type: ObjectId,
                ref: `ClassRoom`,
            },
        ],
        // passwordChangedAt: Date,
        // passwordResetToken: String,
        // passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.pre(`save`, async function (next) {
    if (!this.isModified(`password`)) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre(`save`, function (next) {
    if (!this.isModified(`password`) || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.CheckPass = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.PasswordChanged = function (ExpiresAt) {
//     if (this.passwordChangedAt) {
//         const ChangeAtInms = parseInt(
//             this.passwordChangedAt.getTime() / 1000,
//             10
//         );
//         return ExpiresAt < ChangeAtInms;
//     }
//     return false;
// };

module.exports = mongoose.model(`User`, userSchema);
