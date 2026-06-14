const multer = require("multer");
const fs = require("fs");
const { createUploader } = require("./../base/utils");
const errorFactory = require("sillajError");

const removeUploadedFiles = (req) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {});
  }

  if (req.files && Array.isArray(req.files)) {
    req.files.forEach((file) => {
      fs.unlink(file.path, () => {});
    });
  }

  if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
    Object.values(req.files).forEach((fileArray) => {
      fileArray.forEach((file) => {
        fs.unlink(file.path, () => {});
      });
    });
  }
};

const handleUpload = (type, fieldConfig, method = "single", maxCount = 5) => {
  const uploader = createUploader(type);

  let upload;
  if (method === "array") {
    upload = uploader.array(fieldConfig, maxCount);
  } else if (method === "fields") {
    upload = uploader.fields(fieldConfig);
  } else {
    upload = uploader.single(fieldConfig);
  }

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        removeUploadedFiles(req);
        return next(
          errorFactory.BadRequest("خطا در آپلود فایل: " + err.message),
        );
      }

      if (err) {
        removeUploadedFiles(req);
        return next(err);
      }

      res.on("finish", () => {
        if (res.statusCode >= 400) {
          removeUploadedFiles(req);
        }
      });
      next();
    });
  };
};

module.exports = handleUpload;
