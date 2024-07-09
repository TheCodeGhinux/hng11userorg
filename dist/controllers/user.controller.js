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
    const authenticatedUser = req.user;
    try {
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        const user = await userRepository.findOneBy({ userId: userId });
        if (!user) {
            throw new middlewares_1.BadRequestError(`User with id ${userId} not found`);
        }
        // console.log(user)
        // Check if the authenticated user is the requested user
        if (authenticatedUser.userId === user.userId) {
            return utils_1.ResponseHandler.success(res, {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            }, 200, 'User fetched successfully');
        }
        // const responseData = {
        //   userId: user.userId,
        //   firstName: user.firstName,
        //   lastName: user.lastName,
        //   email: user.email,
        //   phone: user.phone,
        // }
        // if (!user) {
        //   throw new BadRequestError(`User with id ${userId} not found`)
        // } else {
        //   ResponseHandler.success(
        //     res,
        //     responseData,
        //     200,
        //     'User fetched successfully'
        //   )
        // }
        // Check if the authenticated user is in the same organization or the creator
        const organisations = await organisationRepository
            .createQueryBuilder('organisation')
            .leftJoin('organisation.users', 'user')
            .leftJoin('organisation.createdBy', 'creator')
            .where('user.userId = :authenticatedUserId OR creator.userId = :authenticatedUserId', {
            authenticatedUserId: authenticatedUser.userId,
        })
            .getMany();
        const userInOrganisation = organisations.some((org) => (org.users && org.users.some((u) => u.userId === user.userId)) ||
            (org.createdBy && org.createdBy.userId === authenticatedUser.userId));
        if (userInOrganisation) {
            return utils_1.ResponseHandler.success(res, {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            }, 200, 'User fetched successfully');
        }
        throw new middlewares_1.BadRequestError('Access denied, not authorized to take that action');
    }
    catch (error) {
        return next(error);
    }
};
exports.getUserById = getUserById;
//# sourceMappingURL=user.controller.js.map