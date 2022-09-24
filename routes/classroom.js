const express = require(`express`);
const router = express.Router();

const { check } = require(`express-validator`);

const {
    checkClassRoomByTutor,
    getClassRoom,
    createClassRoom,
    updateClassRoom,
    deleteClassRoom,
    getClassroomFeed,
    addStudentsToClassRoom,
} = require(`./../controllers/classroom`);
const { protectAccess, restrictTo } = require(`./../controllers/auth`);

// @desc get classroom
// @access Public
router.get(
    `/classroom/:classroomId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    getClassRoom
);

// @desc create a classroom
// @access Tutor
router.post(
    `/classroom`,
    [
        check(`name`, `Name must be more than 1 char`).isLength({ min: 1 }),
        check(`description`, `Description must be more than 2 char`).isLength({
            min: 2,
        }),
    ],
    protectAccess,
    restrictTo(`tutor`),
    createClassRoom
);

// @desc update a classroom
// @access Tutor
router.put(
    `/classroom/:classroomId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    updateClassRoom
);

// @desc delete a classroom
// @access Tutor
router.delete(
    `/classroom/:classroomId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    deleteClassRoom
);

// @desc add a student
// @access Tutor
router.post(
    `/classroom/:classroomId/:studentId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    addStudentsToClassRoom
);

// @desc classroom feed
// @access Tutor/Student
router.get(`/classfeed`, protectAccess, getClassroomFeed);

module.exports = router;
