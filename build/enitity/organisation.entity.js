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
exports.Organisation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const class_validator_1 = require("class-validator");
let Organisation = class Organisation {
    orgId;
    name;
    description;
    createdBy;
    users;
};
exports.Organisation = Organisation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Organisation.prototype, "orgId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name cannot be empty' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    (0, class_validator_1.Length)(3, 255, { message: 'Name must be between 1 and 255 characters' }),
    __metadata("design:type", String)
], Organisation.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], Organisation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdOrganisations),
    __metadata("design:type", user_entity_1.User)
], Organisation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.organisations),
    __metadata("design:type", Array)
], Organisation.prototype, "users", void 0);
exports.Organisation = Organisation = __decorate([
    (0, typeorm_1.Entity)({ name: 'organisations' })
], Organisation);
//# sourceMappingURL=organisation.entity.js.map