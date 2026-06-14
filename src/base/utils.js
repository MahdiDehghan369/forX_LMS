const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const errorFactory = require("sillajError");
const { operationMessages, FILE_TYPES } = require("./enums");

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}d`,
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired access token", 401);
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired refresh token", 401);
  }
};

const comparePassword = async (normalPassword, hashPassword) => {
  return await bcrypt.compare(normalPassword, hashPassword);
};

const createUploader = (type) => {
  const config = FILE_TYPES[type];
  if (!config) throw new Error("Invalid upload type");

  if (!fs.existsSync(config.dir)) {
    fs.mkdirSync(config.dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, config.dir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const userId = req.user?._id || "guest";
      cb(null, `${type.toLowerCase()}_${userId}_${uniqueSuffix}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: config.limit },
    fileFilter: (req, file, cb) => {
      if (config.mimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          errorFactory.BadRequest(operationMessages["common.file.format"].fa),
          false,
        );
      }
    },
  });
};

const deleteFile = async (path) => {
  try {
    await fs.promises.unlink(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  comparePassword,
  createUploader,
  deleteFile,
};
