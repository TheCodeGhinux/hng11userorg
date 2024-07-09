"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const errorhandler_1 = require("./errorhandler");
const authGuard = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided, please sign in' });
    }
    try {
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        // console.log('Decoded token:', decoded)
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const user = await userRepository.findOneBy({ userId: decoded.userId });
        if (!user) {
            throw new errorhandler_1.UnauthorizedError('User not authorized for this action');
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof errorhandler_1.UnauthorizedError) {
            return res.status(401).json({ message: error.message });
        }
        throw new errorhandler_1.UnauthorizedError('Failed to authenticate user');
    }
};
exports.authGuard = authGuard;
//# sourceMappingURL=authGuard.js.map