"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrgDataSchema = void 0;
const zod_1 = require("zod");
exports.CreateOrgDataSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    description: zod_1.z.string(),
});
//# sourceMappingURL=organisation.zod.js.map