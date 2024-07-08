"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const app_data_source_1 = require("../app-data-source");
const user_entity_1 = require("../enitity/user.entity");
class UserService {
    userRepository;
    constructor() {
        this.userRepository = app_data_source_1.AppDataSource.getRepository(user_entity_1.User);
    }
    async createUser(userData) {
        try {
            const newUser = await this.userRepository.create(userData);
            return await this.userRepository.save(newUser);
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            return await this.userRepository.find();
        }
        catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            return await this.userRepository.findOne({
                where: { email: email },
            });
        }
        catch (error) {
            console.error(`Error getting user with ID ${email}:`, error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            return await this.userRepository.findOne({
                where: { userId: id },
            });
        }
        catch (error) {
            console.error(`Error getting user with ID ${id}:`, error);
            throw error;
        }
    }
    async getUserByFirstName(firstName) {
        try {
            return await this.userRepository.findOne({
                where: { firstName: firstName },
            });
        }
        catch (error) {
            console.error(`Error getting user with ID ${firstName}:`, error);
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map