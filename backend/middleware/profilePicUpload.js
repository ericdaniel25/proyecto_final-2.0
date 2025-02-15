const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(
      __dirname,
      `../../frontend/public/profilePictures/${req.params.id}`
    );
    //const dir = path.join(__dirname, `../../images/`);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const imageExtension = path.extname(file.originalname);
    cb(null, `${req.params.id}${imageExtension}`);
    //    cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`);
  },
});

const profilePicUpload = multer({
  storage: profilePicStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only file types allowed are png,jpg and jpeg"));
    }
  },
});

module.exports = { profilePicUpload };
