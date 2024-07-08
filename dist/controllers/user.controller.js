"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmail = exports.getUserByFirstName = exports.getAllUsers = void 0;
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const utils_1 = require("../utils");
const middlewares_1 = require("../middlewares");
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
const getAllUsers = async (req, res, next) => {
    try {
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const users = await userRepository.find({
            select: ['userId', 'firstName', 'lastName', 'phone'],
        });
        utils_1.ResponseHandler.success(res, users, 200, 'Users fetched succesfully');
    }
    catch (error) {
        console.error('Error getting users:', error);
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new middlewares_1.NotFoundError(`User with ${email} not found`);
        }
        utils_1.ResponseHandler.success(res, user, 200, 'User fetched successfully');
    }
    catch (error) {
        console.error('Error getting user by firstName:', error);
        next(error);
    }
};
exports.getUserByEmail = getUserByEmail;
const getUserByFirstName = async (req, res, next) => {
    try {
        const { firstName } = req.params;
        const user = await userService.getUserByFirstName(firstName);
        if (!user) {
            throw new middlewares_1.NotFoundError(`User with ${firstName} not found`);
        }
        utils_1.ResponseHandler.success(res, user, 200, 'User fetched successfully');
    }
    catch (error) {
        console.error('Error getting user by firstName:', error);
        next(error);
    }
};
exports.getUserByFirstName = getUserByFirstName;
const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    const user = req.user;
    console.log(user);
    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new middlewares_1.BadRequestError(`User with id ${userId} not found`);
        }
        else {
            utils_1.ResponseHandler.success(res, user, 200, 'User fetched successfully');
        }
    }
    catch (error) {
        return next(error);
    }
};
exports.getUserById = getUserById;
//# sourceMappingURL=user.controller.js.map