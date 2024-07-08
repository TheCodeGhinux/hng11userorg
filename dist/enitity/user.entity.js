"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const organisation_entity_1 = require("./organisation.entity");
const class_validator_1 = require("class-validator");
let User = class User {
    userId;
    firstName;
    lastName;
    email;
    password;
    phone;
    createdOrganisations;
    organisations;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name cannot be empty' }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.Length)(3, 255, {
        message: 'First name must be between 3 and 255 characters',
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name cannot be empty' }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.Length)(3, 255, { message: 'Last name must be between 3 and 255 characters' }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'First name cannot be empty' }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password name cannot be empty' }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number cannot be empty' }),
    (0, class_validator_1.IsString)({ message: 'Phone number must be a string' }),
    (0, class_validator_1.Length)(10, 14, {
        message: 'Phone number must be between 10 and 14 characters',
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => organisation_entity_1.Organisation, (organisation) => organisation.createdBy),
    __metadata("design:type", Array)
], User.prototype, "createdOrganisations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => organisation_entity_1.Organisation, (organisation) => organisation.users),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "organisations", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
//# sourceMappingURL=user.entity.js.map