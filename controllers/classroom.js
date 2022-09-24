const ClassRoom = require("../models/classroom");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/user");

// @desc Get classroom By ID
// @route GET /api/user/:userId
// @access Public
exports.checkClassRoomByTutor = async (req, res, next) => {
    try {
        const classroom = await ClassRoom.findById(req.params.classroomId);

        if (!classroom) {
            return res.status(400).json({ error: `No ClassRoom found by ID` });
        }

        // check classroom tutor
        if (req.user._id.toString() != classroom.tutor.toString()) {
            return res.status(404).json({
                error: "Acccess Denied",
            });
        }

        req.classroom = classroom;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.getClassRoom = async (req, res) => {
    try {
        return res.status(200).json({ classroom: req.classroom });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// @desc Create a Classroom
// @route POST /api/user/signup
// @access Tutor
exports.createClassRoom = async (req, res) => {
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

        // Check If ClassRoom already exists
        const classroomExists = await ClassRoom.findOne({ name: name });
        if (classroomExists) {
            return res.status(422).json({ error: `Classroom Already Exists` });
        }

        const newClassroom = await ClassRoom.create({
            name: name,
            description: description,
            tutor: req.user._id,
        });

        if (newClassroom)
            return res
                .status(201)
                .json({ status: "OK", classroom: newClassroom });
        else return res.status(500).json({ error: `Failed to Create` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// @desc Update a Classroom
// @route PUT /api/product/:productId/:userId
// @access Tutor
exports.updateClassRoom = async (req, res) => {
    try {
        const updatedClassroom = await ClassRoom.findByIdAndUpdate(
            { _id: req.params.classroomId },
            { $set: req.body },
            { new: true, useFindAndModify: false }
        );

        if (updatedClassroom) {
            return res
                .status(200)
                .json({ status: "OK", classroom: updatedClassroom });
        } else {
            return res.status(500).json({ error: `No Classroom Found` });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// @desc Delete a Classroom
// @route DELETE /api/offer/all
// @access Tutor
exports.deleteClassRoom = async (req, res) => {
    try {
        const classroom = await ClassRoom.findById(req.params.classroomId);

        const deletedClassroom = await classroom.remove();

        if (deletedClassroom) {
            return res.status(200).json({ status: "OK" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
};

// @desc Add Students to Classroom
// @route POST /api/offer/all
// @access Tutor
exports.addStudentsToClassRoom = async (req, res) => {
    try {
        const classroom = req.classroom;
        if (mongoose.isValidObjectId(req.params.studentId)) {
            const student = await User.findById(req.params.studentId);

            if (!student)
                return res.status(404).json({ error: "User does not exists" });

            if (student.classrooms.includes(classroom._id))
                return res
                    .status(404)
                    .json({ error: "User already exists in classroom" });

            classroom.students.push(req.params.studentId);
            await classroom.save();

            student.classrooms.push(classroom._id);
            await student.save();

            return res.status(200).json({ status: "OK" });
        }
        return res.status(400).json({ error: "Enter Valid Student Id" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

// @desc Delete a Classroom
// @route DELETE /api/offer/all
// @access Tutor
exports.getClassroomFeed = async (req, res) => {
    try {
        if (req.user.role == `student`) {
            const user = await User.findById(req.user._id).populate(
                "classrooms"
            );
            console.log(user);
            return res
                .status(200)
                .json({ status: "Ok", classroom: user.classrooms });
        } else {
            const classrooms = await ClassRoom.find({
                tutor: req.user._id,
            });
            return res
                .status(200)
                .json({ status: "Ok", classroom: classrooms });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};
