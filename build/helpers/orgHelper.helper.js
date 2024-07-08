"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrganisationUsers = void 0;
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const middlewares_1 = require("../middlewares");
const updateOrganisationUsers = async (organisationId, userId, action) => {
    const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
    const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
    const organisation = await organisationRepository.findOne({
        where: { orgId: organisationId },
        relations: ['users'],
    });
    if (!organisation) {
        throw new Error('Organisation not found');
    }
    console.log("user id in helper:", userId);
    const user = await userRepository.findOneBy({ userId });
    if (!user) {
        throw new Error('User not found');
    }
    if (action === 'add') {
        const userExists = organisation.users.some((u) => u.userId === userId);
        if (userExists) {
            throw new middlewares_1.BadRequestError('User already exists in the organisation');
        }
        organisation.users.push(user);
    }
    else if (action === 'remove') {
        organisation.users = organisation.users.filter((u) => u.userId !== userId);
    }
    await organisationRepository.save(organisation);
};
exports.updateOrganisationUsers = updateOrganisationUsers;
//# sourceMappingURL=orgHelper.helper.js.map