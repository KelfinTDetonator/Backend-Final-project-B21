const multer = require("multer");

const dest = "./public/videos";

const generate = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, dest);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
    // console.log(file);
  },
});

module.exports = {
  upload: multer({
    storage: generate,
    async fileFilter(req, file, cb) {
      const allowedMimeTypes = ["video/mp4", "video/x-ms-wmv", "video/x-matroska"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const err = cb(new Error(`Only ${allowedMimeTypes.join(", ")} extensions are allowed!`));
        cb(err, false);
      }
    },
    limits: { files: 5 },
  }),
  onError: (err, next) => {
    console.log(err);
    next(err);
  },
};
