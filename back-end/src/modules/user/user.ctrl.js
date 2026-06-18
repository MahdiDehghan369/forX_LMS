const { operationMessages } = require("../../base/enums");

class UserController {
  constructor(userBl) {
    this.userBl = userBl;
  }

  getUsers = async (req, res, next) => {
    const data = req.query;
    const result = await this.userBl.getUsers(data);
    return res.sendResponse(201, {
      message: operationMessages["user.get.success"].fa,
      data: result,
    });
  };

  getUser = async (req, res, next) => {
    const { userId } = req.params;
    const result = await this.userBl.getUser(userId);
    return res.sendResponse(201, {
      message: operationMessages["user.get.success"].fa,
      data: result,
    });
  };

  deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    await this.userBl.deleteUser(req.user._id, userId);
    return res.sendResponse(200, {
      message: operationMessages["user.delete.success"].fa,
    });
  };

  createUser = async (req, res, next) => {
    const data = req.body;
    const result = await this.userBl.createUser(data);
    return res.sendResponse(201, {
      message: operationMessages["user.create.success"].fa,
      data: result,
    });
  };

  updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const data = req.body;
    const result = await this.userBl.updateUser(userId, data);
    return res.sendResponse(200, {
      message: operationMessages["user.update.success"].fa,
      data: result,
    });
  };

  addPermissions = async (req, res, next) => {
    const { userId } = req.params;
    const { permissions } = req.body;
    const myId = req.user._id;
    const result = await this.userBl.addPermissions(userId, myId, permissions);
    return res.sendResponse(200, {
      message: operationMessages["user.update.success"].fa,
      data: result,
    });
  };

  removePermissions = async (req, res, next) => {
    const { userId } = req.params;
    const { permissions } = req.body;
    const myId = req.user._id;
    const result = await this.userBl.removePermissions(
      userId,
      myId,
      permissions,
    );
    return res.sendResponse(200, {
      message: operationMessages["user.update.success"].fa,
      data: result,
    });
  };

  getPermissions = async (req, res, next) => {
    const { userId } = req.params;
    const result = await this.userBl.getPermissions(userId);
    return res.sendResponse(200, {
      message: operationMessages["user.get.success"].fa,
      data: result,
    });
  };

  updateMyProfile = async (req, res, next) => {
    const userId = req.user._id;
    const data = req.body;
    const updatedUser = await this.userService.updateMyProfile(userId, data);
    return res.sendResponse(200, {
      message: operationMessages["user.profile.updated.successfully"].fa,
      data: updatedUser,
    });
  };

  changePassword = async (req, res, next) => {
    const userId = req.user?._id;
    const data = req.body;
    await this.userService.changePassword(userId, data);
    return res.sendResponse(200, {
      message: operationMessages["user.password.updated.successfully"].fa,
    });
  };

  uploadProfileImage = async (req, res, next) => {
    const userId = req.user?._id;
    const fileData = req?.file;
    const result = await this.userBl.uploadProfileImage(userId, fileData);
    return res.sendResponse(200, {
      message: operationMessages["user.profile.updated.successfully"].fa,
      data: result,
    });
  };

  deleteProfileImage = async (req, res, next) => {
    const userId = req.user?._id;
    await this.userBl.deleteProfileImage(userId);
    return res.sendResponse(200, {
      message: operationMessages["user.profile.image.deleted.successfully"].fa,
    });
  };
}

module.exports = UserController;
