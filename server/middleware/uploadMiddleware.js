import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only video files are allowed"), false);
    }
};

export const uploadVideoMiddleware = multer({
    storage: storage,
    // limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
    fileFilter: fileFilter,
}).single("video");
