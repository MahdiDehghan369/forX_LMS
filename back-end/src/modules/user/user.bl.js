const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");
const { comparePassword, deleteFile } = require("../../base/utils");
const path = require("path");

class UserBl {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  #checkUserExists = async (userId) => {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw errorFactory.NotFound(
        operationMessages["common.user_not_found"].fa,
      );
    }
    return user;
  };

  getUsers = async (data) => {
    const result = await this.userRepo.findByFilter(data);
    return result;
  };

  getUser = async (userId) => {
    const user = await this.#checkUserExists(userId);
    return user;
  };

  deleteUser = async (myId, userId) => {
    if (myId.toString() === userId.toString()) {
      throw errorFactory.Forbidden(
        operationMessages["user.delete.own.error"].fa,
      );
    }
    await this.#checkUserExists(userId);
    await this.userRepo.deleteUserById(userId);
  };

  createUser = async (data) => {
    const {
      firstName,
      lastName,
      username,
      phone,
      email,
      permissions,
      password,
    } = data;

    const normalized = {
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
    };

    const duplicateChecks = [
      {
        field: "username",
        value: normalized.username,
        message: operationMessages["user.username.duplicate.error"].fa,
      },
      {
        field: "email",
        value: normalized.email,
        message: operationMessages["user.email.duplicate.error"].fa,
      },
      {
        field: "phone",
        value: normalized.phone,
        message: operationMessages["user.phone.duplicate.error"].fa,
      },
    ];

    const [existingUsername, existingEmail, existingPhone] = await Promise.all([
      this.userRepo.findOne({ username: normalized.username }),
      this.userRepo.findOne({ email: normalized.email }),
      this.userRepo.findOne({ phone: normalized.phone }),
    ]);

    const existingValues = {
      username: existingUsername,
      email: existingEmail,
      phone: existingPhone,
    };

    const duplicate = duplicateChecks.find(
      ({ field }) => existingValues[field],
    );

    if (duplicate) {
      throw errorFactory.Conflict(duplicate.message);
    }

    return await this.userRepo.createUser({
      firstName,
      lastName,
      username: normalized.username,
      phone: normalized.phone,
      email: normalized.email,
      permissions,
      password,
    });
  };

  updateUser = async (userId, data) => {
    const uniqueFields = {
      username: "user.username.duplicate.error",
      email: "user.email.duplicate.error",
      phone: "user.phone.duplicate.error",
    };

    const checks = Object.entries(uniqueFields)
      .filter(([field]) => data[field])
      .map(async ([field, messageKey]) => {
        const existing = await this.userRepo.findOne({
          [field]: data[field],
          _id: { $ne: userId },
        });

        if (existing) {
          throw errorFactory.Conflict(operationMessages[messageKey].fa);
        }
      });

    await Promise.all(checks);

    const updatedUser = await this.userRepo.updateUserById(userId, data);
    if (!updatedUser) {
      throw errorFactory.NotFound(
        operationMessages["common.user_not_found"].fa,
      );
    }
    return updatedUser;
  };

  addPermissions = async (userId, myId, newPermissions) => {
    if (userId.toString() === myId.toString()) {
      throw errorFactory.Forbidden(
        operationMessages["user.change.own.permission.error"].fa,
      );
    }
    const user = await this.userRepo.updateUserById(
      userId,
      { $addToSet: { permissions: { $each: newPermissions } } },
      { new: true },
    );
    if (!user) {
      throw errorFactory.NotFound(
        operationMessages["common.user_not_found"].fa,
      );
    }
    return user;
  };

  removePermissions = async (userId, myId, permissionsToRemove) => {
    if (userId.toString() === myId.toString()) {
      throw errorFactory.Forbidden(
        operationMessages["user.change.own.permission.error"].fa,
      );
    }
    const user = await this.userRepo.updateUserById(
      userId,
      { $pull: { permissions: { $in: permissionsToRemove } } },
      { new: true },
    );
    if (!user) {
      throw errorFactory.NotFound(
        operationMessages["common.user_not_found"].fa,
      );
    }
    return user;
  };

  getPermissions = async (userId) => {
    const user = await this.userRepo.findById(userId, {
      select: "permissions",
    });
    if (!user) {
      throw errorFactory.NotFound(
        operationMessages["common.user_not_found"].fa,
      );
    }
    return user;
  };

  updateMyProfile = async (userId, updateData) => {
    const allowedFields = ["firstName", "lastName", "bio", "phone", "email"];
    const filteredData = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const updatedUser = await this.userRepo.updateUserById(
      userId,
      filteredData,
    );

    if (!updatedUser) {
      throw errorFactory.NotFound(
        operationMessages["common.user_not_found"].fa,
      );
    }

    return updatedUser;
  };

  changePassword = async (userId, data) => {
    const user = await this.#checkUserExists(userId);

    const isMatch = await comparePassword(data.currentPassword, user.password);
    if (!isMatch) {
      throw errorFactory.BadRequest(
        operationMessages["user.password.wrong.error"],
      );
    }
    await this.userRepo.updateUserById(userId, { password: data.newPassword });
  };

  uploadProfileImage = async (userId, fileData) => {
    const user = await this.#checkUserExists(userId);

    if (user.avatarUrl) {
      const oldImagePath = path.join("public", user.avatarUrl);
      await deleteFile(oldImagePath);
    }
    const newImageUrl = path.join("profiles", fileData.filename);
    const updatedUser = await this.userRepo.updateUserById(userId, {
      avatarUrl: newImageUrl,
    });

    return updatedUser;
  };

  deleteProfileImage = async (userId) => {
    const user = await this.#checkUserExists(userId);
    if (!user.avatarUrl) return;

    const imagePathToDelete = path.join("public", user?.avatarUrl);
    await deleteFile(imagePathToDelete);

    await this.userRepo.updateUserById(userId, {
      avatarUrl: null,
    });
  };
}

module.exports = UserBl;
