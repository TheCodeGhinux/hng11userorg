"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
// import { CustomRequest } from '../types/customRequest'
// import { AppDataSource } from '../data-source'
// import { User } from '../entities/User'
// import { Organisation } from '../entities/Organisation'
const authorization = async (req, res, next) => {
    const userId = req.params.id;
    if (!req.user) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    try {
        if (req.user.userId === userId) {
            return next();
        }
        const organisationRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.Organisation);
        const organisations = await organisationRepository
            .createQueryBuilder('organisation')
            .leftJoinAndSelect('organisation.users', 'user')
            .leftJoinAndSelect('organisation.createdBy', 'creator')
            .where('organisation.createdBy = :userId', { userId: req.user.userId })
            .orWhere('user.userId = :userId', { userId: req.user.userId })
            .getMany();
        const hasAccess = organisations.some((org) => org.createdBy.userId === req.user.userId ||
            org.users.some((user) => user.userId === userId));
        if (hasAccess) {
            return next();
        }
        return res.status(403).json({ message: 'Not authorized' });
    }
    catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.authorization = authorization;
//# sourceMappingURL=authorization.js.map