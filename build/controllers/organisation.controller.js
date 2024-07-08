"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromOrganisation = exports.addUserToOrganisation = exports.getOrganisationById = exports.getUserOrganisation = exports.getAllOrganisation = exports.createOrganisation = void 0;
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const utils_1 = require("../utils");
const middlewares_1 = require("../middlewares");
const orgHelper_helper_1 = require("../helpers/orgHelper.helper");
const organisation_zod_1 = require("../middlewares/validations/organisation.zod");
const zod_validation_error_1 = require("zod-validation-error");
const createOrganisation = async (req, res, next) => {
    try {
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        // Extract user data from request body
        const { name, description } = req.body;
        try {
            organisation_zod_1.CreateOrgDataSchema.parse(req.body);
        }
        catch (err) {
            const validationError = (0, zod_validation_error_1.fromError)(err).toString();
            throw new middlewares_1.UnprocessableEntityError(validationError);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new middlewares_1.BadRequestError('User not found');
        }
        const user = await userRepository.findOneBy({ userId: userId });
        if (!user) {
            throw new middlewares_1.BadRequestError('No user found with the email');
        }
        const newOrganisation = organisationRepository.create({
            name,
            description,
            createdBy: userId, // Assign the logged-in user as the creator
        });
        // Save the new organisation to the database
        await organisationRepository.save(newOrganisation);
        const responseData = {
            name: newOrganisation.name,
            description: newOrganisation.description,
        };
        // Respond with success message
        utils_1.ResponseHandler.success(res, responseData, 201, 'New organization created successfully');
    }
    catch (error) {
        console.error('Error creating user and organisation:', error);
        next(error);
    }
};
exports.createOrganisation = createOrganisation;
const getAllOrganisation = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        // Query organizations where the logged-in user is either the creator or a member
        const organisations = await organisationRepository
            .createQueryBuilder('organisation')
            .leftJoinAndSelect('organisation.users', 'user')
            .leftJoinAndSelect('organisation.createdBy', 'creator')
            .where('user.userId = :userId OR creator.userId = :userId', { userId })
            .getMany();
        const responseData = {
            organisations: organisations.map((org) => ({
                orgId: org.orgId,
                name: org.name,
                description: org.description || '',
            })),
        };
        utils_1.ResponseHandler.success(res, responseData, 200, 'Organisations fetched successfully');
    }
    catch (error) {
        console.error('Error getting organisations:', error);
        next(error);
    }
};
exports.getAllOrganisation = getAllOrganisation;
const getUserOrganisation = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const organisationId = req.params.orgId;
        console.log(req.user);
        if (!userId) {
            throw new middlewares_1.BadRequestError('User not found');
        }
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        // Query the organization by orgId and ensure the logged-in user has access
        const organisation = await organisationRepository
            .createQueryBuilder('organisation')
            .leftJoinAndSelect('organisation.users', 'user')
            .leftJoinAndSelect('organisation.createdBy', 'creator')
            .where('organisation.orgId = :organisationId AND (user.userId = :userId OR creator.userId = :userId)', {
            organisationId,
            userId,
        })
            .getOne();
        if (!organisation) {
            throw new middlewares_1.NotFoundError('Organisation not found or access denied');
        }
        const responseData = {
            orgId: organisation.orgId,
            name: organisation.name,
            description: organisation.description || '',
        };
        utils_1.ResponseHandler.success(res, responseData, 200, 'Organisation fetched successfully');
    }
    catch (error) {
        console.error('Error getting organisation:', error);
        next(error);
    }
};
exports.getUserOrganisation = getUserOrganisation;
const getOrganisationById = async (req, res, next) => {
    try {
        // const { email } = req.params
        // const user = await userService.getUserByEmail(email)
        // if (!user) {
        //   throw new NotFoundError(`User with ${email} not found`)
        // }
        // ResponseHandler.success(res, user, 200, 'User fetched successfully')
    }
    catch (error) {
        console.error('Error getting user by firstName:', error);
        next(error);
    }
};
exports.getOrganisationById = getOrganisationById;
const addUserToOrganisation = async (req, res, next) => {
    const { userId } = req.body;
    const { orgId } = req.params;
    console.log(orgId);
    try {
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        if (!userId) {
            throw new middlewares_1.BadRequestError('No user id provided');
        }
        if (!orgId) {
            throw new middlewares_1.BadRequestError('No user id provided');
        }
        const organsationId = await organisationRepository.findOneBy({
            orgId: orgId,
        });
        if (!organsationId) {
            throw new middlewares_1.NotFoundError('No organisation found with the provided ID');
        }
        const user = await userRepository.findOneBy({ userId: userId });
        if (!user) {
            throw new middlewares_1.NotFoundError('No user found with the provided ID');
        }
        await (0, orgHelper_helper_1.updateOrganisationUsers)(orgId, userId, 'add');
        const responseData = {};
        utils_1.ResponseHandler.success(res, null, 200, 'User added to organisation successfully');
    }
    catch (error) {
        console.error('Error adding user to organisation:', error);
        next(error);
    }
};
exports.addUserToOrganisation = addUserToOrganisation;
const removeUserFromOrganisation = async (req, res, next) => {
    const { organisationId, userId } = req.body;
    try {
        await (0, orgHelper_helper_1.updateOrganisationUsers)(organisationId, userId, 'remove');
        utils_1.ResponseHandler.success(res, null, 200, 'User removed from organisation successfully');
    }
    catch (error) {
        console.error('Error removing user from organisation:', error);
        next(error);
    }
};
exports.removeUserFromOrganisation = removeUserFromOrganisation;
//# sourceMappingURL=organisation.controller.js.map