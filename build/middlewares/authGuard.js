"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const authGuard = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        console.log('Decoded token:', decoded);
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const user = await userRepository.findOneBy({ userId: decoded.userId });
        if (!user) {
            console.log('User not found for token:', decoded.userId);
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Failed to authenticate token:', error);
        return res.status(401).json({ message: 'Failed to authenticate token' });
    }
};
exports.authGuard = authGuard;
//# sourceMappingURL=authGuard.js.map