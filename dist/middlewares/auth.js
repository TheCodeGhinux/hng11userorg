"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const app_data_source_1 = require("../app-data-source");
const enitity_1 = require("../enitity");
const authenticate = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // console.log(token);
    try {
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        console.log(decoded);
        const userRepository = app_data_source_1.AppDataSource.getRepository(enitity_1.User);
        const user = await userRepository.findOneBy({ userId: decoded.userId });
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map