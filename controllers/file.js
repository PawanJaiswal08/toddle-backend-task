const File = require("../models/file");
const ClassRoom = require("../models/classroom");
const { validationResult } = require("express-validator");

const MIME_TYPE_MAP = {
    "audio/mp3": "AUDIO",
    "audio/mpeg": "AUDIO",
    "video/mp4": "VIDEO",
    "video/mpeg": "VIDEO",
    "image/png": "IMAGE",
    "image/jpeg": "IMAGE",
    "image/jpg": "IMAGE",
};

// @desc Get classroom By ID
// @route GET /api/user/:userId
// @access Public
exports.getFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.fileId);
        return res.status(200).json({ status: `OK`, file: file });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: `No File found` });
    }
};

// @desc Get all files in classroom
// @route GET /api/user/:userId
// @access Public
exports.getAllFilesInClassRoom = async (req, res) => {
    try {
        const files = await File.find({ classroom: req.params.classroomId });
        if (files) return res.status(200).json({ status: "OK", files: files });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: `No Files found` });
    }
};

// @desc Create a Classroom
// @route POST /api/user/signup
// @access Tutor
exports.uploadFile = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res
                .status(422)
                .json({ error: `Please fill all fields properly` });
        }

        // Validation Results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        // Check If Email already exists
        const fileExists = await File.findOne({ name: name });
        if (fileExists) {
            return res
                .status(422)
                .json({ error: `File with this name already exists` });
        }

        // uploaded file
        const file = req.file;
        console.log(file);
        const filetype = MIME_TYPE_MAP[file.mimetype];

        const classroom = await ClassRoom.findById(req.params.classroomId);

        const newFile = await File.create({
            name: name,
            description: description,
            filetype: filetype,
            uploaded_by: classroom.tutor,
            classroom: classroom._id,
            file: file.path,
        });

        if (newFile) {
            return res.status(201).json({ status: "OK", file: newFile });
        } else {
            return res.status(500).json({ error: `Failed to Create` });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// @desc Update a Classroom
// @route PUT /api/product/:productId/:userId
// @access Tutor
exports.updateFile = async (req, res) => {
    try {
        const updatedFile = await File.findByIdAndUpdate(
            { _id: req.params.fileId },
            { $set: req.body },
            { new: true, useFindAndModify: false }
        );

        if (updatedFile) {
            return res.status(200).json({
                status: "OK",
                file: updatedFile,
            });
        } else {
            return res.status(500).json({ error: `No File Found` });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// @desc Delete a Classroom
// @route DELETE /api/offer/all
// @access Admin
exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);

        const deletedFile = await file.remove();

        if (deletedFile) {
            return res.status(200).json({
                status: "OK",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
};

// @desc Delete a Classroom
// @route DELETE /api/offer/all
// @access Admin
exports.searchFile = async (req, res) => {
    try {
        const file = await File.find({ name: req.params.filename });
        if (file) {
            return res.status(200).json({
                status: "OK",
                file: file,
            });
        }
        return res.status(400).json({ error: `No such file exists` });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
};
