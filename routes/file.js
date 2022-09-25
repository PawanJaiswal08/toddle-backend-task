const express = require(`express`);
const router = express.Router();

const { protectAccess, restrictTo } = require(`./../controllers/auth`);
const { checkClassRoomByTutor } = require(`./../controllers/classroom`);
const {
    getFile,
    getAllFilesInClassRoom,
    uploadFile,
    updateFile,
    deleteFile,
    searchFile,
} = require(`./../controllers/file`);

const upload = require(`./../utils/multer`);

// @desc get a file
// @access Tutor/Student
router.get(
    `/files/:fileId`,
    protectAccess,
    restrictTo(`tutor`, `student`),
    getFile
);

// @desc upload a file
// @access Tutor
router.post(
    `/files/:classroomId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    upload.single(`file`),
    uploadFile
);

// @desc update a file
// @access Tutor
router.put(
    `/files/:fileId/:classroomId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    updateFile
);

// @desc delete a file
// @access Tutor
router.delete(
    `/files/:fileId/:classroomId`,
    protectAccess,
    restrictTo(`tutor`),
    checkClassRoomByTutor,
    deleteFile
);

// @desc search a file by filename
// @access Tutor
router.get(
    `/files/search/:filename`,
    protectAccess,
    restrictTo(`tutor`, `student`),
    searchFile
);

// @desc get all files in a classroom
// @access Tutor/Student
router.get(
    `/classroom/:classroomId/filesfeed`,
    protectAccess,
    restrictTo(`tutor`, `student`),
    getAllFilesInClassRoom
);

module.exports = router;
