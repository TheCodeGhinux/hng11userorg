"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils");
const jwtUtils_1 = require("../utils/jwtUtils");
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const user_zod_1 = require("../middlewares/validations/user.zod");
const zod_validation_error_1 = require("zod-validation-error");
const middlewares_1 = require("../middlewares");
const loginUser = async (req, res, next) => {
    try {
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const { email, password } = req.body;
        const user = await userRepository.findOneBy({ email: email });
        if (!user) {
            throw new middlewares_1.BadRequestError('No user found with the email');
        }
        const checkPassword = await bcrypt_1.default.compare(password, user.password);
        if (!checkPassword) {
            throw new middlewares_1.BadRequestError('Invalid password, please provide a valid password');
        }
        const token = (0, jwtUtils_1.generateToken)(user);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        const userResponse = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        };
        const response = {
            accessToken: token,
            user: userResponse,
        };
        utils_1.ResponseHandler.success(res, response, 200, 'Logged in successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const createUser = async (req, res, next) => {
    try {
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        // Extract user data from request body
        const { firstName, lastName, email, password, phone } = req.body;
        // const schemaRes = CreateUserDataSchema.parse(req.body)
        try {
            user_zod_1.CreateUserDataSchema.parse(req.body);
        }
        catch (err) {
            const validationError = (0, zod_validation_error_1.fromError)(err).toString();
            throw new middlewares_1.UnprocessableEntityError(validationError);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        if (!hashedPassword) {
            throw new middlewares_1.BadRequestError('Invalid password, please provide a valid password');
        }
        // Create a new user
        const newUser = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });
        // Save user to database
        await userRepository.save(newUser);
        // Generate organization name
        const orgName = `${firstName}'s Organisation`;
        // Create a new organisation linked to the user
        const newOrganisation = organisationRepository.create({
            name: orgName,
            createdBy: newUser,
        });
        // Save organisation to database
        await organisationRepository.save(newOrganisation);
        const token = (0, jwtUtils_1.generateToken)(newUser);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        const userResponse = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
        };
        const response = {
            accessToken: token,
            user: userResponse,
        };
        // Respond with success message
        utils_1.ResponseHandler.success(res, response, 201, 'User and organization created successfully');
    }
    catch (error) {
        // console.error('Error creating user and organisation:', error)
        next(error);
    }
};
exports.createUser = createUser;
//# sourceMappingURL=auth.controlller.js.map