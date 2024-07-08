"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgAccessGuard = void 0;
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const errorhandler_1 = require("./errorhandler");
const orgAccessGuard = async (req, res, next) => {
    const userId = req.user?.userId;
    const organisationId = req.params.id || req.body.organisationId;
    if (!userId || !organisationId) {
        throw new errorhandler_1.BadRequestError('User not found');
    }
    try {
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        const organisation = await organisationRepository.findOne({
            where: { orgId: organisationId },
            relations: ['users', 'createdBy'],
        });
        if (!organisation) {
            throw new errorhandler_1.BadRequestError('Organisation not found');
        }
        const isCreator = organisation.createdBy.userId === userId;
        const isMember = organisation.users.some((user) => user.userId === userId);
        if (isCreator || isMember) {
            return next();
        }
        else {
            throw new errorhandler_1.ForbiddenError('User not authorized for this action');
        }
    }
    catch (error) {
        console.error('Error checking organisation access:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.orgAccessGuard = orgAccessGuard;
//# sourceMappingURL=orgAcess.middlware.js.map