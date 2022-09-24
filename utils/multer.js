const multer = require(`multer`);
const { v4: uuidv4 } = require(`uuid`);

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "video/mp4": "mp4",
    "video/mpeg": "mp4",
    "audio/mpeg": "mp3",
};

const upload = multer({
    limits: 700000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/`);
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + "." + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error(`Invalid mime type !`);
        cb(error, isValid);
    },
});

module.exports = upload;
